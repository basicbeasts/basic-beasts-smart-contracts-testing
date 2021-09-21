import CharacterX from "../../../contracts/Project/CharacterX.cdc"

pub fun main(): [CharacterX.CharacterY] {
    return CharacterX.getAllCharacters()
}