import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(characterID: UInt32): {String: String} {
    let traits = CharacterX.getCharacterTraits(characterID: characterID)
        ?? panic("Character doesn't exist")

    return traits
}