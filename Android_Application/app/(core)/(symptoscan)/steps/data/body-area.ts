export type Symptom = {
  id: string
  label: string
  areaId?: string
  isCustom?: boolean
}

export type BodyArea = {
  id: string
  name: string
  symptoms: Symptom[]
}

// Central catalog of body areas and related symptoms.
// Extend or tweak labels as needed — IDs are stable, lower_snake_case.
export const BODY_AREAS: BodyArea[] = [
  {
    id: "head_face",
    name: "Head & Face",
    symptoms: [
      { id: "headache", label: "Headache", areaId: "head_face" },
      { id: "migraine", label: "Migraine", areaId: "head_face" },
      { id: "dizziness", label: "Dizziness", areaId: "head_face" },
      { id: "facial_pain", label: "Facial pain", areaId: "head_face" },
      { id: "sinus_congestion", label: "Sinus congestion", areaId: "head_face" },
      { id: "runny_nose", label: "Runny nose", areaId: "head_face" },
      { id: "sore_throat", label: "Sore throat", areaId: "head_face" },
      { id: "eye_strain", label: "Eye strain", areaId: "head_face" },
      { id: "blurred_vision", label: "Blurred vision", areaId: "head_face" },
      { id: "ear_pain", label: "Ear pain", areaId: "head_face" },
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    symptoms: [
      { id: "dry_cough", label: "Dry cough", areaId: "respiratory" },
      { id: "productive_cough", label: "Productive cough", areaId: "respiratory" },
      { id: "shortness_of_breath", label: "Shortness of breath", areaId: "respiratory" },
      { id: "wheezing", label: "Wheezing", areaId: "respiratory" },
      { id: "chest_tightness", label: "Chest tightness", areaId: "respiratory" },
      { id: "sore_throat_resp", label: "Sore throat", areaId: "respiratory" },
      { id: "nasal_congestion", label: "Nasal congestion", areaId: "respiratory" },
      { id: "loss_of_smell", label: "Loss of smell", areaId: "respiratory" },
    ],
  },
  {
    id: "digestive",
    name: "Digestive System",
    symptoms: [
      { id: "nausea", label: "Nausea", areaId: "digestive" },
      { id: "vomiting", label: "Vomiting", areaId: "digestive" },
      { id: "abdominal_pain", label: "Abdominal pain", areaId: "digestive" },
      { id: "diarrhea", label: "Diarrhea", areaId: "digestive" },
      { id: "constipation", label: "Constipation", areaId: "digestive" },
      { id: "bloating", label: "Bloating", areaId: "digestive" },
      { id: "heartburn", label: "Heartburn/acid reflux", areaId: "digestive" },
      { id: "loss_of_appetite", label: "Loss of appetite", areaId: "digestive" },
    ],
  },
  {
    id: "muscles_joints",
    name: "Muscles & Joints",
    symptoms: [
      { id: "joint_pain", label: "Joint pain", areaId: "muscles_joints" },
      { id: "muscle_ache", label: "Muscle ache", areaId: "muscles_joints" },
      { id: "stiffness", label: "Stiffness", areaId: "muscles_joints" },
      { id: "swelling", label: "Swelling", areaId: "muscles_joints" },
      { id: "back_pain", label: "Back pain", areaId: "muscles_joints" },
      { id: "neck_pain", label: "Neck pain", areaId: "muscles_joints" },
      { id: "cramps", label: "Cramps", areaId: "muscles_joints" },
      { id: "limited_range", label: "Limited range of motion", areaId: "muscles_joints" },
    ],
  },
  {
    id: "skin",
    name: "Skin",
    symptoms: [
      { id: "rash", label: "Rash", areaId: "skin" },
      { id: "itching", label: "Itching", areaId: "skin" },
      { id: "redness", label: "Redness", areaId: "skin" },
      { id: "dry_skin", label: "Dry skin", areaId: "skin" },
      { id: "hives", label: "Hives", areaId: "skin" },
      { id: "swelling_skin", label: "Swelling", areaId: "skin" },
      { id: "acne", label: "Acne", areaId: "skin" },
      { id: "bruising", label: "Easy bruising", areaId: "skin" },
    ],
  },
  {
    id: "general",
    name: "General",
    symptoms: [
      { id: "fatigue", label: "Fatigue", areaId: "general" },
      { id: "fever", label: "Fever", areaId: "general" },
      { id: "chills", label: "Chills", areaId: "general" },
      { id: "night_sweats", label: "Night sweats", areaId: "general" },
      { id: "unintentional_weight_loss", label: "Unintentional weight loss", areaId: "general" },
      { id: "weight_gain", label: "Weight gain", areaId: "general" },
      { id: "loss_of_energy", label: "Loss of energy", areaId: "general" },
      { id: "poor_appetite", label: "Poor appetite", areaId: "general" },
    ],
  },
]

// How to use:
// import { BODY_AREAS, type BodyArea, type Symptom } from "@/data/body-areas"
