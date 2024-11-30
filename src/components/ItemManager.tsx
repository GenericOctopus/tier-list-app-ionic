import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { add, trash } from 'ionicons/icons';
import { TierItem, Tier } from '../types/TierTypes';

interface Props {
  items: TierItem[];
  tiers: Tier[];
  onItemsChange: (items: TierItem[]) => void;
  onAssignToTier: (itemId: string, tierId: string) => void;
}

const ItemManager: React.FC<Props> = ({ items, tiers, onItemsChange, onAssignToTier }) => {
  const [newItemName, setNewItemName] = useState('');

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: TierItem = {
      id: Date.now().toString(),
      name: newItemName,
    };
    
    onItemsChange([...items, newItem]);
    setNewItemName('');
  };

  const deleteItem = (itemId: string) => {
    onItemsChange(items.filter(item => item.id !== itemId));
  };

  return (
    <div>
      <div className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">New Item</IonLabel>
          <IonInput
            value={newItemName}
            onIonChange={e => setNewItemName(e.detail.value || '')}
            placeholder="Enter item name"
          />
          <IonButton slot="end" onClick={addItem}>
            <IonIcon icon={add} />
            Add Item
          </IonButton>
        </IonItem>
      </div>

      <IonList>
        {items.map((item) => (
          <IonItemSliding key={item.id}>
            <IonItem>
              <IonLabel>{item.name}</IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Select Tier"
                onIonChange={e => onAssignToTier(item.id, e.detail.value)}
              >
                {tiers.map(tier => (
                  <IonSelectOption key={tier.id} value={tier.id}>
                    {tier.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            
            <IonItemOptions side="end">
              <IonItemOption color="danger" onClick={() => deleteItem(item.id)}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonList>
    </div>
  );
};

export default ItemManager;
