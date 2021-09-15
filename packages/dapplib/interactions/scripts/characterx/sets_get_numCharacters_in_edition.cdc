import CharacterX from Project.CharacterX

pub fun main(setID: UInt32, characterID: UInt32): UInt32 {

    let numCharacters = CharacterX.getNumNFTCharactersInEdition(setID: setID, characterID: characterID)
        ?? panic("Couldn't find the specified edition")

    return numCharacters
}