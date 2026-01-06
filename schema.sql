-- Create Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_address TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    image_url TEXT,
    w_votes INTEGER NOT NULL DEFAULT 0,
    trash_votes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    voter_wallet TEXT NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('W', 'TRASH')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(room_id, voter_wallet)
);

-- Create Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    voter_wallet TEXT NOT NULL,
    message_text TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rooms_ca ON rooms(contract_address);
CREATE INDEX IF NOT EXISTS idx_votes_room_wallet ON votes(room_id, voter_wallet);
CREATE INDEX IF NOT EXISTS idx_messages_room_time ON messages(room_id, created_at);
