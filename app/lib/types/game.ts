export interface GameData {
  clues: string[];
  options: string[];
  correctCountry: string;
  trivia: string;
}

export interface GameFeedback {
  correct: boolean;
  fact: string;
}

export interface GameQuestion {
  clues: string[];
  options: string[];
  correctCountry: string;
}

export interface GameResponse {
  correct: boolean;
  fact: string;
}

export interface ChallengeData {
  code: string;
  shareUrl: string;
  imageUrl: string;
  inviterScore: number;
}

export interface Challenge {
  id?: string;
  code: string;
  inviterUsername: string;
  inviterScore: number;
  expiresAt: Date;
}

export interface ChallengeShare {
  code: string;
  shareUrl: string;
  imageUrl: string;
}

export interface User {
  id?: string;
  username: string;
  score: number;
}

export interface Destination {
  id?: string;
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface GameBoardProps {
  challengeMode?: boolean;
  targetScore?: number;
}
