'use client';

import React, { useState } from 'react';
import { CHARACTER_MAP } from '@/data/characters';
import { TimelineSnapshot } from '@/data/types';
import { ActiveTab, Header } from '@/components/Header';
import { FamilyTreeView } from '@/components/FamilyTreeView';
import { DragonCodexView } from '@/components/DragonCodexView';
import { RelationshipFinder } from '@/components/RelationshipFinder';
import { FactionWarRoom } from '@/components/FactionWarRoom';
import { CharacterDrawer } from '@/components/CharacterDrawer';
import { TimelineBar } from '@/components/TimelineBar';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tree');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedDragonId, setSelectedDragonId] = useState<string>('vhagar');
  const [activeSnapshot, setActiveSnapshot] = useState<TimelineSnapshot | null>(null);
  const [focusRequestId, setFocusRequestId] = useState<{ id: string; nonce: number } | null>(null);

  const [kinshipA, setKinshipA] = useState<string>('daemon');
  const [kinshipB, setKinshipB] = useState<string>('rhaenyra');

  const handleJumpToCharacter = (id: string) => {
    setActiveTab('tree');
    setSelectedCharacterId(id);
    setFocusRequestId({ id, nonce: Date.now() });
  };

  const handleSelectDragon = (id: string) => {
    setSelectedDragonId(id);
    setActiveTab('dragons');
  };

  const handleCompareCharacter = (id: string) => {
    setKinshipA(id);
    if (kinshipB === id) {
      setKinshipB(id === 'rhaenyra' ? 'aegon-ii' : 'rhaenyra');
    }
    setActiveTab('kinship');
    setSelectedCharacterId(null);
  };

  const selectedCharacter = selectedCharacterId ? CHARACTER_MAP[selectedCharacterId] ?? null : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSelectCharacter={handleJumpToCharacter}
        onSelectDragon={handleSelectDragon}
      />

      <main className="flex-1">
        {activeTab === 'tree' && (
          <FamilyTreeView
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={setSelectedCharacterId}
            activeSnapshot={activeSnapshot}
            focusRequestId={focusRequestId}
          />
        )}

        {activeTab === 'dragons' && (
          <DragonCodexView
            selectedDragonId={selectedDragonId}
            onSelectDragon={setSelectedDragonId}
            onJumpToCharacter={handleJumpToCharacter}
            activeSnapshot={activeSnapshot}
          />
        )}

        {activeTab === 'kinship' && (
          <RelationshipFinder
            charAId={kinshipA}
            charBId={kinshipB}
            onChangeA={setKinshipA}
            onChangeB={setKinshipB}
            onJumpToCharacter={handleJumpToCharacter}
            onSelectDragon={handleSelectDragon}
          />
        )}

        {activeTab === 'warroom' && (
          <FactionWarRoom
            onJumpToCharacter={handleJumpToCharacter}
            onSelectDragon={handleSelectDragon}
          />
        )}
      </main>

      {/* Right Character Detail Drawer (visible when a character is selected in Tree view) */}
      {activeTab === 'tree' && (
        <CharacterDrawer
          character={selectedCharacter}
          onClose={() => setSelectedCharacterId(null)}
          onSelectCharacter={(id) => {
            setSelectedCharacterId(id);
            setFocusRequestId({ id, nonce: Date.now() });
          }}
          onSelectDragon={handleSelectDragon}
          onCompareCharacter={handleCompareCharacter}
        />
      )}

      {/* Docked Bottom Timeline Scrubber */}
      <TimelineBar
        activeSnapshot={activeSnapshot}
        onSelectSnapshot={setActiveSnapshot}
        onSelectCharacter={handleJumpToCharacter}
      />
    </div>
  );
}
