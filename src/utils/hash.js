import bcrypt from "bcrypt";

export const createHash = (hash) =>
    bcrypt.hashSync(hash, bcrypt.genSaltSync(10));

export const isValidHash = (hash, originalHash) =>
    bcrypt.compareSync(hash, originalHash);
