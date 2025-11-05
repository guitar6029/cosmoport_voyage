export type Item = {
  id: string
  name: string
  description: string
  category: 'resource' | 'component' | 'tool' | 'artifact' | 'consumable' | 'data' | 'currency'
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  imageUrl?: string
  value?: number
}
