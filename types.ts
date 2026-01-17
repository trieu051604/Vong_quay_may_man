
export interface Participant {
  id: string;
  name: string;
  team: string;
  eligible: boolean;
  hasWon?: boolean;
}

export interface Prize {
  prizeId: string;
  prizeName: string;
  quantity: number;
  imageUrl: string;
  order: number;
  wonCount: number;
}

export interface Result {
  time: string;
  prizeId: string;
  prizeName: string;
  participantId: string;
  name: string;
  team: string;
}

export interface AppSettings {
  apiBaseUrl: string;
  allowMultipleWins: boolean;
}
