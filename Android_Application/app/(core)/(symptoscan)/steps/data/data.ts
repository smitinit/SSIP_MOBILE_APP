// Static data only. No React imports here.

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

export const BODY_AREAS: BodyArea[] = [
  {
    id: "head_face",
    name: "Head & Face",
    symptoms: [
      { id: "headache", label: "Headache", areaId: "head_face" },
      { id: "dizziness", label: "Dizziness", areaId: "head_face" },
      { id: "sinus_pain", label: "Sinus pain", areaId: "head_face" },
      { id: "eye_strain", label: "Eye strain", areaId: "head_face" },
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory System",
    symptoms: [
      { id: "cough", label: "Cough", areaId: "respiratory" },
      { id: "short_breath", label: "Shortness of breath", areaId: "respiratory" },
      { id: "chest_tight", label: "Chest tightness", areaId: "respiratory" },
    ],
  },
  {
    id: "digestive",
    name: "Digestive System",
    symptoms: [
      { id: "nausea", label: "Nausea", areaId: "digestive" },
      { id: "abdominal_pain", label: "Abdominal pain", areaId: "digestive" },
      { id: "diarrhea", label: "Diarrhea", areaId: "digestive" },
    ],
  },
  {
    id: "muscles_joints",
    name: "Muscles & Joints",
    symptoms: [
      { id: "joint_pain", label: "Joint pain", areaId: "muscles_joints" },
      { id: "muscle_ache", label: "Muscle ache", areaId: "muscles_joints" },
      { id: "stiffness", label: "Stiffness", areaId: "muscles_joints" },
    ],
  },
  {
    id: "skin",
    name: "Skin",
    symptoms: [
      { id: "rash", label: "Rash", areaId: "skin" },
      { id: "itching", label: "Itching", areaId: "skin" },
      { id: "dry_skin", label: "Dry skin", areaId: "skin" },
    ],
  },
  {
    id: "general",
    name: "General",
    symptoms: [
      { id: "fatigue", label: "Fatigue", areaId: "general" },
      { id: "fever", label: "Fever", areaId: "general" },
      { id: "chills", label: "Chills", areaId: "general" },
      { id: "weight_loss", label: "Unintentional weight loss", areaId: "general" },
    ],
  },
]