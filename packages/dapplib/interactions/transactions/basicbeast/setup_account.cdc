import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction() {

    prepare(acct: AuthAccount) {

        if acct.borrow<&BasicBeast.Collection>(from: BasicBeast.CollectionStoragePath) == nil {

            let collection <- BasicBeast.createEmptyCollection() as! @BasicBeast.Collection

            acct.save(<- collection, to: BasicBeast.CollectionStoragePath)

            acct.link<&{BasicBeast.BeastCollectionPublic}>(BasicBeast.CollectionPublicPath, target: BasicBeast.CollectionStoragePath)
        }

    }
}

