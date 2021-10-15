import BasicBeast from "../../../contracts/Project/BasicBeast.cdc"

transaction {

    let adminRef: &BasicBeast.Admin
    let currentGeneration: UInt32

    prepare(acct: AuthAccount) {
        self.adminRef = acct.borrow<&BasicBeast.Admin>(from: BasicBeast.AdminStoragePath)
            ?? panic("No Admin resource in storage")

        self.currentGeneration = BasicBeast.currentGeneration

    }

    execute {
        self.adminRef.startNewGeneration()
    }

    post {
        BasicBeast.currentGeneration == self.currentGeneration + 1 as UInt32:
            "New Generation is not started"
    }
}