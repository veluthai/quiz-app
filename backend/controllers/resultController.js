import Result from "../models/resultModels.js";


// CREATE RESULT
export async function createResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
     const JWT_SECRET = "your_jwt_secret_here";
    const {
      title,
      technology,
      level,
      totalQuestions,
      correct,
      wrong,
    } = req.body;

    if (
      !title ||
      !technology ||
      !level ||
      totalQuestions === undefined ||
      correct === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const payload = {
      title: title.trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong:
        wrong !== undefined
          ? Number(wrong)
          : Math.max(0, Number(totalQuestions) - Number(correct)),

      // Save result for logged in user
      user: req.user.id,
    };

    const created = await Result.create(payload);

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      result: created,
    });
  } catch (err) {
    console.error("Create Result Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}



// GET RESULTS OF LOGGED IN USER
export async function listResults(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { technology } = req.query;

    const query = {
      user: req.user.id,
    };

    if (technology && technology !== "all") {
      query.technology = technology;
    }

    const items = await Result.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      results: items,
    });
  } catch (err) {
    console.error("List Result Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}