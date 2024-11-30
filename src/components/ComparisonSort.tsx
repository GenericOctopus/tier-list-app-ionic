import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonText,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { TierItem } from '../types/TierTypes';

interface Props {
  items: TierItem[];
  onSortComplete: (sortedItems: TierItem[]) => void;
  tierLabel: string;
}

interface Comparison {
  item1: TierItem;
  item2: TierItem;
}

const ComparisonSort: React.FC<Props> = ({ items, onSortComplete, tierLabel }) => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [currentComparison, setCurrentComparison] = useState<Comparison | null>(null);
  const [progress, setProgress] = useState(0);
  const [rankings, setRankings] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (items.length < 2) {
      onSortComplete(items);
      return;
    }

    // Generate all needed comparisons
    const comps: Comparison[] = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        comps.push({
          item1: items[i],
          item2: items[j],
        });
      }
    }
    setComparisons(comps);
    setCurrentComparison(comps[0]);
    setProgress(0);
    setRankings({});
  }, [items]);

  const handleChoice = (winner: TierItem, loser: TierItem) => {
    // Update rankings
    const newRankings = { ...rankings };
    newRankings[winner.id] = (newRankings[winner.id] || 0) + 1;
    newRankings[loser.id] = newRankings[loser.id] || 0;
    setRankings(newRankings);

    const remainingComparisons = comparisons.slice(1);
    
    // If we're done with all comparisons, sort the items
    if (remainingComparisons.length === 0) {
      const sortedItems = [...items].sort((a, b) => {
        const scoreA = newRankings[a.id] || 0;
        const scoreB = newRankings[b.id] || 0;
        return scoreB - scoreA;
      });
      onSortComplete(sortedItems);
      setCurrentComparison(null);
    } else {
      setComparisons(remainingComparisons);
      setCurrentComparison(remainingComparisons[0]);
    }

    // Update progress
    const totalComparisons = (items.length * (items.length - 1)) / 2;
    const completedComparisons = totalComparisons - remainingComparisons.length;
    setProgress(completedComparisons / totalComparisons);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === '1') {
      handleChoice(currentComparison!.item1, currentComparison!.item2);
    } else if (event.key === 'ArrowRight' || event.key === '2') {
      handleChoice(currentComparison!.item2, currentComparison!.item1);
    }
  };

  useEffect(() => {
    // Add keyboard listener when component mounts
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentComparison]); // Re-add listener when comparison changes

  if (!currentComparison) {
    return (
      <IonCard>
        <IonCardContent>
          <IonText>Sorting of {tierLabel} tier complete!</IonText>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Compare items in {tierLabel} tier</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonProgressBar value={progress}></IonProgressBar>
        <div className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton 
                  expand="block"
                  onClick={() => handleChoice(currentComparison.item1, currentComparison.item2)}
                  className="comparison-button"
                >
                  {currentComparison.item1.name}
                </IonButton>
              </IonCol>
              <IonCol size="2" className="ion-text-center">
                <div className="ion-padding-top">vs</div>
              </IonCol>
              <IonCol>
                <IonButton 
                  expand="block"
                  onClick={() => handleChoice(currentComparison.item2, currentComparison.item1)}
                  className="comparison-button"
                >
                  {currentComparison.item2.name}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ComparisonSort;
