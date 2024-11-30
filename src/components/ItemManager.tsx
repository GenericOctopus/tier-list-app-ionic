import React, { useState, useRef } from 'react';
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
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { add, trash, document } from 'ionicons/icons';
import { TierItem, Tier } from '../types/TierTypes';

interface Props {
  items: TierItem[];
  tiers: Tier[];
  onItemsChange: (items: TierItem[]) => void;
  onAssignToTier: (itemId: string, tierId: string) => void;
}

const ItemManager: React.FC<Props> = ({ items, tiers, onItemsChange, onAssignToTier }) => {
  const [newItemName, setNewItemName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: TierItem = {
      id: Date.now().toString(),
      name: newItemName,
    };
    
    onItemsChange([...items, newItem]);
    setNewItemName('');
  };

  const addItems = (itemNames: string[]) => {
    const newItems = itemNames
      .filter(name => name.trim()) // Filter out empty lines
      .map(name => ({
        id: Date.now() + Math.random().toString(),
        name: name.trim(),
      }));
    
    onItemsChange([...items, ...newItems]);
  };

  const deleteItem = (itemId: string) => {
    onItemsChange(items.filter(item => item.id !== itemId));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n');
      addItems(lines);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <div>
      <div className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">New Item</IonLabel>
              <IonInput
                value={newItemName}
                onIonChange={e => setNewItemName(e.detail.value || '')}
                enterkeyhint="enter"
                onKeyUp={(e: any) => {
                  if (e.key === 'Enter') {
                    addItem();
                  }
                }}
                placeholder="Enter item name"
              />
              <IonButton slot="end" onClick={addItem}>
                <IonIcon icon={add} />
                Add Item
              </IonButton>
            </IonItem>

            <div className="ion-padding-top">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <IonButton expand="block" onClick={() => fileInputRef.current?.click()}>
                <IonIcon slot="start" icon={document} />
                Upload Items from Text File
              </IonButton>
              <div className="ion-padding-top ion-text-center ion-color-medium">
                <small>Upload a .txt file with one item per line</small>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
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
