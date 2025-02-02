
import FUSD from "../../../contracts/Flow/FUSD.cdc"

transaction {
  prepare (acct: AuthAccount) {
    let adminRef = acct.borrow<&FUSD.Administrator>(from: FUSD.AdminStoragePath) ?? panic("Could not borrow reference")
    acct.save(<- adminRef.createNewMinter(), to: /storage/fusdMinter)
  }
}