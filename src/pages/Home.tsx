import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import TierManager from '../components/TierManager';
import ItemManager from '../components/ItemManager';
import ComparisonSort from '../components/ComparisonSort';
import { Tier, TierItem, TierList } from '../types/TierTypes';
import './Home.css';

const Home: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string>('tiers');
  const [tierList, setTierList] = useState<TierList>({
    id: '1',
    name: 'My Tier List',
    tiers: [],
    items: [],
  });
  const [currentSortingTier, setCurrentSortingTier] = useState<number>(0);
  const [sortingComplete, setSortingComplete] = useState<boolean>(false);

  const handleTiersChange = (newTiers: Tier[]) => {
    setTierList({ ...tierList, tiers: newTiers });
  };

  const handleItemsChange = (newItems: TierItem[]) => {
    setTierList({ ...tierList, items: newItems });
  };

  const handleAssignToTier = (itemId: string, tierId: string) => {
    const item = tierList.items.find(i => i.id === itemId);
    if (!item) return;

    // Remove item from unassigned items
    const newItems = tierList.items.filter(i => i.id !== itemId);
    
    // Add item to selected tier
    const newTiers = tierList.tiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          items: [...tier.items, item],
        };
      }
      return tier;
    });

    setTierList({
      ...tierList,
      items: newItems,
      tiers: newTiers,
    });
  };

  const handleSortComplete = (sortedItems: TierItem[]) => {
    const newTiers = [...tierList.tiers];
    newTiers[currentSortingTier] = {
      ...newTiers[currentSortingTier],
      items: sortedItems,
    };

    setTierList({
      ...tierList,
      tiers: newTiers,
    });

    // Move to next tier or complete sorting
    if (currentSortingTier < tierList.tiers.length - 1) {
      setCurrentSortingTier(currentSortingTier + 1);
    } else {
      setSortingComplete(true);
      setActiveSegment('results');
    }
  };

  const renderSortingView = () => {
    const currentTier = tierList.tiers[currentSortingTier];
    if (!currentTier || currentTier.items.length < 2) {
      // Skip to next tier if current one can't be sorted
      if (currentSortingTier < tierList.tiers.length - 1) {
        setCurrentSortingTier(currentSortingTier + 1);
      } else {
        setSortingComplete(true);
        setActiveSegment('results');
      }
      return <div>Moving to next tier...</div>;
    }

    return (
      <ComparisonSort
        items={currentTier.items}
        onSortComplete={handleSortComplete}
        tierLabel={currentTier.label}
      />
    );
  };

  const renderResults = () => {
    return (
      <div className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Final Tier List</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {tierList.tiers.map((tier) => (
              <div key={tier.id} className="tier-row">
                <IonGrid>
                  <IonRow>
                    <IonCol size="2">
                      <div className="tier-label">{tier.label}</div>
                    </IonCol>
                    <IonCol>
                      <div className="tier-items">
                        {tier.items.map((item, index) => (
                          <div key={item.id} className="tier-item">
                            {item.name}
                            {index < tier.items.length - 1 && " > "}
                          </div>
                        ))}
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            ))}
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tier List Maker</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeSegment} onIonChange={e => setActiveSegment(e.detail.value!)}>
            <IonSegmentButton value="tiers">
              <IonLabel>Define Tiers</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="items">
              <IonLabel>Add Items</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="sort" disabled={tierList.tiers.length === 0 || !tierList.tiers.some(tier => tier.items.length >= 2)}>
              <IonLabel>Sort</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="results" disabled={!sortingComplete}>
              <IonLabel>Results</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {activeSegment === 'tiers' && (
          <TierManager
            tiers={tierList.tiers}
            onTiersChange={handleTiersChange}
          />
        )}
        
        {activeSegment === 'items' && (
          <ItemManager
            items={tierList.items}
            tiers={tierList.tiers}
            onItemsChange={handleItemsChange}
            onAssignToTier={handleAssignToTier}
          />
        )}
        
        {activeSegment === 'sort' && renderSortingView()}
        
        {activeSegment === 'results' && renderResults()}
      </IonContent>
    </IonPage>
  );
};

export default Home;
