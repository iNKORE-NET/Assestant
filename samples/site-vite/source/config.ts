import { configureAssestant } from "../../../packages/runtime/dist/config";

configureAssestant({ isOnline: true });
configureAssestant("dummy", { assetSource: "auto" });