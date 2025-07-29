import { encrypt } from "@/utils/encryption.util";
import { IProject } from "@/types/project";
import { Schema, HydratedDocument, Model } from "mongoose";
import slugify from "slugify";

export const projectPreHooks = (schema: Schema) => {
  schema.pre("save", async function (this: HydratedDocument<IProject>, next) {
    if (!this.isModified("credentials")) return next();

    try {
      for (const credential of this.credentials) {
        if (credential.password) {
          credential.encrypted_password = encrypt(credential.password);
          credential.password = undefined;
        }
      }
      next();
    } catch (err) {
      next(err as Error);
    }
  });

  schema.pre("save", async function (this: HydratedDocument<IProject>, next) {
    if (!this.isModified("name") && this.slug) return next();
    if (!this.name) return next(new Error("Name is required to generate slug"));

    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;
    const ProjectModel = this.constructor as Model<IProject>;
    while (await ProjectModel.exists({ slug, _id: { $ne: this._id } })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }
    this.slug = slug;
    next();
  });
};
