import mongoose, { Schema, model, models, mongo } from "mongoose";

const VIDEO_DIMENSIONS = {
  width: 1920,
  height: 1080,
  quality: 480,
} as const;

export interface IVideo {
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls? : boolean;
  transformation?: {
    width: number;
    height: number;
    quality: number;
  };
  _id? : mongoose.Types.ObjectId;
  createdAt? : Date;
  updatedAt? : Date;
}

const videoSchema = new Schema<IVideo>({
    title : {type : String, required:true},
    videoUrl : {type : String, required:true},
    thumbnailUrl : {type : String, required:true},
    transformation : {
        width : {type : Number, default : VIDEO_DIMENSIONS.width},
        height : {type : Number, default : VIDEO_DIMENSIONS.height},
        quality : {type : Number, default : VIDEO_DIMENSIONS.quality}
    },
    controls : { type : Boolean, default : true}
},
{
    timestamps : true
})

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video;