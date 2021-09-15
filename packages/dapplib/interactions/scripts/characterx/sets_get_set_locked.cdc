import CharacterX from Project.CharacterX

pub fun main(setID: UInt32): Bool {

    let isLocked = CharacterX.isSetLocked(setID: setID)
        ?? panic("Coulnd't find the specified set")

    return isLocked
}