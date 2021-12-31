import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import AssetInfo from "../models/interfaces/AssetInfo";
import gw2MapGen from "../services/gw2MapGen";
let cloudinary = require("cloudinary").v2;

export default class MapGenController {
    private mapGen: gw2MapGen;
    private public_id: string;
    

    constructor(id: number, mode: string) {
        this.mapGen = new gw2MapGen(id);
        this.public_id = `gw2-maps/${mode}/${id}`;
    }

    /**
     * Checks if a given image exists on our cloud
     */
    private getAssetInfoByPublicID = async (): Promise<AssetInfo> => {
        const response = await cloudinary.api.resources();
        return response.resources.find((resource: AssetInfo) => resource.public_id === this.public_id);        
    }

    private async uploadMapToCloud(buffer: Buffer): Promise<UploadApiResponse> {
        console.log("Uploading to cloudinary");
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    public_id: this.public_id
                },
                (error: Error, result: UploadApiResponse) => {
                    result ? resolve(result) : reject(error);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        })        
    }

    public async handleMutation() {
        // checks first if the image wasnt already created
        const assetInfo = await this.getAssetInfoByPublicID();
        if (assetInfo){
            return assetInfo.secure_url;
        }

        const canvas = await this.mapGen.createBmap();
        const buffer = canvas.toBuffer('image/jpeg');
        console.log("Successful generation!");

        const uploadResponse = await this.uploadMapToCloud(buffer);
        console.log("Success!");

        return uploadResponse.secure_url;
    }

}