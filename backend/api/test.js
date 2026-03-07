module.exports = (req, res) => {
    res.status(200).json({ message: "Vercel route is working!", env: !!process.env.DATABASE_URL });
};
