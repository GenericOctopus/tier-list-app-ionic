export interface Tier {
    id: string;
    label: string;
    color?: string;
    items: TierItem[];
}

export interface TierItem {
    id: string;
    name: string;
    rank?: number; // Used for sorting within tier
}

export interface TierList {
    id: string;
    name: string;
    tiers: Tier[];
    items: TierItem[]; // Unassigned items
}
