var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import { areYouACreatorOfThisCourse } from '../lesson/lessonController.js';
const prisma = new PrismaClient();
// Api to create a video for a course and a lesson 
export const createVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { description, poster_url, video_url, video_number, lesson_id, course_id } = req.body;
    try {
        //check if the lesson id and course id are there
        if (!lesson_id || !course_id) {
            return res.status(400).json({ error: "lesson id and course id is required" });
        }
        //you can only create video for this lesson if you are the creator of the course
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to create video for this lesson." });
        }
        //checking if the video number already created for this lesson
        const existingVideo = yield prisma.video.findFirst({
            where: {
                video_number: video_number,
                lesson_id: lesson_id,
            },
        });
        if (existingVideo) {
            return res.status(400).json({ error: "The video number for the lesson already exists!" });
        }
        //creating video
        const newVideo = yield prisma.video.create({
            data: {
                description: description,
                poster_url: poster_url,
                video_url: video_url,
                video_number: video_number,
                lesson: { connect: { id: lesson_id } },
                course: { connect: { id: course_id } }
            },
        });
        return res.status(201).json(newVideo);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//Api to edit the video for a lesson only if are the creator of the course.
export const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const video_id = req.params.id;
    const { description, poster_url, video_url, course_id } = req.body;
    try {
        //check if the video id and course id are there
        if (!course_id || !video_id) {
            return res.status(400).json({ error: "video id and course id is required" });
        }
        //you can only edit the video for this lesson if you are the creator of the course
        const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to edit this video for this lesson." });
        }
        //updating the video
        const updatedVideo = yield prisma.video.update({
            where: {
                id: video_id,
            },
            data: {
                description: description,
                poster_url: poster_url,
                video_url: video_url,
            },
        });
        return res.status(200).json(updatedVideo);
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
export const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const video_id = req.query.video_id;
    const course_id = req.query.course_id;
    try {
        //check if the video id and course id are there
        if (!course_id || !video_id) {
            return res.status(400).json({ error: "video id and course id is required" });
        }
        //you can only edit the video for this lesson if you are the creator of the course
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        if (!(yield areYouACreatorOfThisCourse(user_id, course_id))) {
            return res.status(400).json({ error: "you are not the authorize to edit this video for this lesson." });
        }
        yield prisma.video.delete({
            where: {
                id: video_id,
            },
        });
        return res.status(200).json({ message: "Successfully deleted!" });
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error', details: error });
    }
});
//# sourceMappingURL=videoController.js.map