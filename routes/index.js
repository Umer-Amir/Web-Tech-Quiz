import express from "express";
const router = express.Router();
import { db } from "../models/index.js";

router.get("/curriculum", async (req, res) => {
  const curriculum = await db.Curriculum.aggregate([
    {
      $lookup: {
        from: "courses",
        foreignField: "cid",
        localField: "cid",
        as: "course",
      },
    },
    { $unwind: "$course" },
    {
      $project: { _id: 1, curid: 1, cid: 1, title: "$course.title", semno: 1 },
    },
  ]).sort("semno");
  res.status(200).json(curriculum);
});

router.get("/faculties", async (req, res) => {
  const faculties = await db.Faculty.aggregate([
    {
      $lookup: {
        from: "areas",
        localField: "fid",
        foreignField: "fid",
        as: "areas",
      },
    },
  ]);
  res.status(200).json(faculties);
});

export default router;
