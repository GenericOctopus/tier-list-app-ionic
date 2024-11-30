import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonReorder,
  IonReorderGroup,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { Tier } from '../types/TierTypes';

interface Props {
  tiers: Tier[];
  onTiersChange: (tiers: Tier[]) => void;
}

const TierManager: React.FC<Props> = ({ tiers, onTiersChange }) => {
  const [newTierLabel, setNewTierLabel] = useState('');

  const addTier = () => {
    if (!newTierLabel.trim()) return;
    
    const newTier: Tier = {
      id: Date.now().toString(),
      label: newTierLabel,
      items: [],
    };
    
    onTiersChange([...tiers, newTier]);
    setNewTierLabel('');
  };

  const deleteTier = (tierId: string) => {
    onTiersChange(tiers.filter(tier => tier.id !== tierId));
  };

  const handleReorder = (event: CustomEvent) => {
    const newTiers = [...tiers];
    const itemToMove = newTiers.splice(event.detail.from, 1)[0];
    newTiers.splice(event.detail.to, 0, itemToMove);
    onTiersChange(newTiers);
    event.detail.complete();
  };

  return (
    <div>
      <div className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">New Tier Label</IonLabel>
          <IonInput
            value={newTierLabel}
            onIonChange={e => setNewTierLabel(e.detail.value || '')}
            enterkeyhint="enter"
            onKeyUp={(e: any) => {
              if (e.key === 'Enter') {
                addTier();
              }
            }}
            placeholder="Enter tier label (e.g., S, A, B or 1, 2, 3)"
          />
          <IonButton slot="end" onClick={addTier}>
            <IonIcon icon={add} />
            Add Tier
          </IonButton>
        </IonItem>
      </div>

      <IonList>
        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
          {tiers.map((tier) => (
            <IonItemSliding key={tier.id}>
              <IonItem>
                <IonLabel>{tier.label}</IonLabel>
                <IonReorder slot="end" />
              </IonItem>
              
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => deleteTier(tier.id)}>
                  <IonIcon slot="icon-only" icon={trash} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonReorderGroup>
      </IonList>
    </div>
  );
};

export default TierManager;
