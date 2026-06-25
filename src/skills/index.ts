import { descriptor as cacModel } from "./cac-model";
import { descriptor as creativeVariants } from "./creative-variants";

export interface SkillDescriptor {
  name: string;
  description: string;
}

export const SKILLS: SkillDescriptor[] = [cacModel, creativeVariants];
