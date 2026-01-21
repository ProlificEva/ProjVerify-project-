const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const pool = require('../config/db');
const { getGeminiEmbedding } = require('../services/aiService');

const getS3Client = () => {
    return new S3Client({
        region: process.env.REGION_S3 || "us-west-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
};

// --- SUBMIT PROPOSAL ---
exports.uploadProposal = async (req, res) => {
    try {
        const { title, abstract } = req.body;
        const userId = req.user.sub; // From checkAuth middleware
        
        if (!req.file) return res.status(400).json({ error: "No file provided" });

        const s3Client = getS3Client();
        const fileKey = `proposals/${userId}/${Date.now()}_${req.file.originalname}`;

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }));

        const embedding = await getGeminiEmbedding(abstract);

        const query = `
            INSERT INTO proposals (user_id, title, abstract, s3_key, embedding)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const values = [userId, title, abstract, fileKey, JSON.stringify(embedding)];
        const dbResult = await pool.query(query, values);

        res.status(200).json({ 
            message: "Proposal submitted successfully!",
            proposalId: dbResult.rows[0].id
        });

    } catch (error) {
        console.error("SUBMISSION ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// --- GET MY SUBMISSIONS (DASHBOARD) ---
exports.getMyProposals = async (req, res) => {
    try {
        const userId = req.user.sub; 
        const s3Client = getS3Client();

        const query = 'SELECT id, title, abstract, s3_key, report_data, created_at FROM proposals WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);

        const proposalsWithFiles = await Promise.all(result.rows.map(async (p) => {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: p.s3_key,
            });
            // URL expires in 1 hour (3600 seconds)
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            
            return { 
                ...p, 
                file_url: signedUrl 
            };
        }));

        res.status(200).json(proposalsWithFiles);
    } catch (error) {
        console.error("FETCH ERROR:", error);
        res.status(500).json({ message: "Error fetching proposals" });
    }
};

// --- VALIDATE ORIGINALITY ---
exports.validateOriginality = async (req, res) => {
    try {
        const { abstract } = req.body;
        if (!abstract) return res.status(400).json({ error: "No abstract provided" });

        const newVector = await getGeminiEmbedding(abstract);

        const sql = `
            SELECT title, created_at,
                   (1 - (embedding <=> $1)) * 100 AS similarity_score
            FROM proposals
            ORDER BY similarity_score DESC
            LIMIT 3;
        `;

        const dbResult = await pool.query(sql, [JSON.stringify(newVector)]);
        
        const matches = dbResult.rows.map(row => ({
            title: row.title,
            similarity: parseFloat(row.similarity_score).toFixed(1) + "%",
            submittedOn: new Date(row.created_at).toLocaleDateString()
        }));

        const topSimilarity = dbResult.rows.length > 0 ? parseFloat(dbResult.rows[0].similarity_score) : 0;
        
        res.status(200).json({
            report: {
                originalityScore: (100 - topSimilarity).toFixed(1) + "%",
                status: topSimilarity > 70 ? "High Risk" : topSimilarity > 30 ? "Moderate Risk" : "Low Risk",
                similarProjects: matches
            }
        });
    } catch (error) {
        console.error("VALIDATION ERROR:", error);
        res.status(500).json({ error: "Plagiarism check failed" });
    }
};

exports.searchProposals = async (req, res) => {
    try {
        const { query } = req.query; 
        const queryVector = await getGeminiEmbedding(query);
        const sql = `SELECT id, title, abstract FROM proposals ORDER BY (embedding <=> $1) ASC LIMIT 5;`;
        const result = await pool.query(sql, [JSON.stringify(queryVector)]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};