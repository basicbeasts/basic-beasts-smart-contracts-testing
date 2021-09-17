import CharacterX from Project.CharacterX

transaction() {

    prepare(acct: AuthAccount) {

        if acct.borrow<&CharacterX.Collection>(from: CharacterX.CollectionStoragePath) == nil {

            let collection <- CharacterX.createEmptyCollection() as! @CharacterX.Collection

            acct.save(<- collection, to: CharacterX.CollectionStoragePath)

            acct.link<&{CharacterX.CharacterCollectionPublic}>(CharacterX.CollectionPublicPath, target: CharacterX.CollectionStoragePath)
        }

    }
}

