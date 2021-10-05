'use strict';
const Blockchain = require('./blockchain');
const dappConfig = require('./dapp-config.json');
const ClipboardJS = require('clipboard');
const BN = require('bn.js'); // Required for injected code
const manifest = require('../manifest.json');
const t = require('@onflow/types');


module.exports = class DappLib {


    /********** FUSD **********/

    // FUSDSetupAccount
    // calls transactions/FUSD/create_FUSD_vault.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async FUSDCreateFUSDVault(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'FUSD_create_FUSD_vault'
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // FUSDMintTokens
    // calls transactions/FUSD/mint_FUSDs.cdc
    //
    // signer/proposer/authorizer: config.accounts[0]
    //
    static async FUSDMintFUSDs(data) {

        let config = DappLib.getConfig()
        let result = await Blockchain.post({
                config: config,
                roles: {
                    proposer: config.accounts[0]
                }
            },
            'FUSD_mint_FUSDs', {
                to: { value: data.to, type: t.Address },
                amount: { value: data.amount, type: t.UFix64 }
            }
        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }
    }

    // FUSDCreateMinter
    // calls transactions/FUSD/create_FUSD_minter.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async FUSDCreateMinter(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'FUSD_create_FUSD_minter', {}
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // FUSDGetFUSDBalance
    // calls scripts/FUSD/get_FUSD_balance.cdc
    //
    // signer/proposer/authorizer: none
    //
    static async FUSDGetFUSDBalance(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'FUSD_get_FUSD_balance', {
                address: { value: data.address, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'FUSD Balance',
            result: result.callData
        }

    }

    // FUSDGetFUSDSupply
    // calls scripts/FUSD/get_FUSD_supply.cdc
    //
    // signer/proposer/authorizer: none
    //
    static async FUSDGetFUSDSupply(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'FUSD_get_FUSD_supply'
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'FUSD Supply',
            result: result.callData
        }
    }

    /********** HERO **********/


    // heroAddLineageKeyValuePair
    // calls transactions/hero/add_lineage_key_value_pair.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroAddLineageKeyValuePair(data) {

        let config = DappLib.getConfig()
        let result = await Blockchain.post({
                config: config,
                roles: {
                    proposer: data.signer
                }
            },
            'hero_add_lineage_key_value_pair', {
                lineage: DappLib.formatFlowDictionary(data.lineage, { key: t.String, value: t.Bool }),
                heroStructID: { value: parseInt(data.heroStructID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }


    // heroCreateSet
    // calls transactions/hero/create_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroCreateSet(data) {

        let config = DappLib.getConfig()
        let result = await Blockchain.post({
                config: config,
                roles: {
                    proposer: data.signer
                }
            },
            'hero_create_set', {
                setName: { value: data.setName, type: t.String }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxGetSetName
    // calls scripts/characterx/sets_get_setName.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxGetSetName(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_setName', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Set name is',
            result: result.callData
        }

    }


    // heroMintHero
    // calls transactions/hero/mint_hero.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroMintHero(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'hero_mint_hero', {
                setID: { value: parseInt(data.setID), type: t.UInt32 },
                heroStructID: { value: parseInt(data.heroStructID), type: t.UInt32 },
                recipientAddr: { value: data.recipientAddr, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }


    // heroCreateHero
    // calls transactions/hero/create_hero_struct.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroCreateHero(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'hero_create_hero_struct', {

                name: { value: data.name, type: t.String },
                sex: { value: data.sex, type: t.String },
                race: { value: data.race, type: t.String },
                rarity: { value: data.rarity, type: t.String },
                createdAt: { value: parseInt(data.createdAt), type: t.UInt64 },
                createdFrom: DappLib.formatFlowArray(data.createdFrom, t.UInt64),
                lineages: DappLib.formatFlowDictionary(data.lineages, { key: t.String, value: t.Bool }),
                bloodlines: DappLib.formatFlowDictionary(data.bloodlines, { key: t.String, value: t.Bool }),
                elements: DappLib.formatFlowDictionary(data.elements, { key: t.String, value: t.Bool }),
                traits: DappLib.formatFlowDictionary(data.traits, { key: t.String, value: t.String }),
                data: DappLib.formatFlowDictionary(data.data, { key: t.String, value: t.String })

            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // heroAddHeroStructToSet
    // calls transactions/hero/add_hero_struct_to_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroAddHeroStructToSet(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'hero_add_hero_struct_to_set', {
                setID: { value: parseInt(data.setID), type: (t.UInt32) },
                heroStructID: { value: parseInt(data.heroStructID), type: (t.UInt32) }

            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxAddCharactersToSet
    // calls transactions/characterx/add_characters_to_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxAddCharactersToSet(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_add_characters_to_set', {
                setID: { value: parseInt(data.setID), type: (t.UInt32) },
                characters: DappLib.formatFlowArray(data.characters, t.UInt32)
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxBatchMintCharacter
    // calls transactions/characterx/batch_mint_character.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxBatchMintCharacter(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_batch_mint_character', {
                setID: { value: parseInt(data.setID), type: t.UInt32 },
                characterID: { value: parseInt(data.characterID), type: t.UInt32 },
                quantity: { value: parseInt(data.quantity), type: t.UInt64 },
                recipientAddr: { value: data.recipientAddr, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxFulfillSingle
    // calls transactions/characterx/fulfill_single.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxFulfillSingle(data) {
        let config = DappLib.getConfig()
        let result = await Blockchain.post({
                config: config,
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_fulfill_single', {
                recipientAddr: { value: data.recipientAddr, type: t.Address },
                characterID: { value: parseInt(data.characterID), type: t.UInt64 }
            }
        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxFulfillPack
    // calls transactions/characterx/fulfill_pack.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxFulfillPack(data) {
        let config = DappLib.getConfig()
        let result = await Blockchain.post({
                config: config,
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_fulfill_pack', {
                recipientAddr: { value: data.recipientAddr, type: t.Address },
                characterIDs: DappLib.formatFlowArray(data.characterIDs, t.UInt64)
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxLockSet
    // calls transactions/characterx/lock_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxLockSet(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_lock_set', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxRetireAllCharactersFromSet
    // calls transactions/characterx/retireAll_characters_from_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxRetireAllCharactersFromSet(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_retireAll_characters_from_set', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxRetireCharacterFromSet
    // calls transactions/characterx/retire_character_from_set.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxRetireCharacterFromSet(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_retire_character_from_set', {
                setID: { value: parseInt(data.setID), type: t.UInt32 },
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxStartNewSeries
    // calls transactions/characterx/start_new_series.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxStartNewSeries(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_start_new_series', {

            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }


    // characterxBuyingNFTWithReferral
    // calls transactions/characterx/buying_NFT_with_referral.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxBuyingNFTWithReferral(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_buying_NFT_with_referral', {
                amount: { value: data.amount, type: t.UFix64 },
                to: { value: data.to, type: t.Address },
                referrer: { value: data.referrer, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // characterxBuyingNFTWithoutReferral
    // calls transactions/characterx/buying_NFT_without_referral.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async characterxBuyingNFTWithoutReferral(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'characterx_buying_NFT_without_referral', {
                amount: { value: data.amount, type: t.UFix64 },
                to: { value: data.to, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    // heroSetupAccount
    // calls transactions/hero/setup_account.cdc
    //
    // signer/proposer/authorizer: data.signer
    //
    static async heroSetupAccount(data) {

        let result = await Blockchain.post({
                config: DappLib.getConfig(),
                roles: {
                    proposer: data.signer
                }
            },
            'hero_setup_account'
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    /********** Scripts **********/

    // characterxGetCurrentSeries
    // calls scripts/characterx/get_currentSeries.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxGetCurrentSeries(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_get_currentSeries', {}
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The current series is',
            result: result.callData
        }

    }

    // characterxGetTotalSupply
    // calls scripts/characterx/get_totalSupply.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxGetTotalSupply(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_get_totalSupply', {}
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The total supply is',
            result: result.callData
        }

    }

    // heroHeroesGetAllHeroes
    // calls scripts/hero/heroes_get_all_heroes.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async heroHeroesGetAllHeroes(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'hero_heroes_get_all_heroes', {}
        );

        console.log(result)

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'All heroes',
            result: result.callData
        }
    }

    // characterxCharactersGetNextCharacterID
    // calls scripts/characterx/characters_get_nextCharacterID.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetNextCharacterID(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_nextCharacterID', {}
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The next character ID is',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterName
    // calls scripts/characterx/characters_get_character_name.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterName(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_name', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING












            ,
            label: 'Name for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterDescription
    // calls scripts/characterx/characters_get_character_description.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterDescription(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_description', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Description for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterImage
    // calls scripts/characterx/characters_get_character_image.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterImage(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_image', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Image for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterCreatedFrom_1
    // calls scripts/characterx/characters_get_character_created_from_1.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterCreatedFrom1(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_created_from_1', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Created From 1 for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterCreatedFrom_2
    // calls scripts/characterx/characters_get_character_created_from_2.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterCreatedFrom2(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_created_from_2', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Created From 2 for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterSex
    // calls scripts/characterx/characters_get_character_sex.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterSex(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_sex', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Sex for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterRace
    // calls scripts/characterx/characters_get_character_race.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterRace(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_race', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Race for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterRarity
    // calls scripts/characterx/characters_get_character_rarity.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterRarity(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_rarity', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Rarity for the requested character',
            result: result.callData
        }

    }

    // heroHeroesGetHeroLineage
    // calls scripts/hero/heroes_get_hero_lineages.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async heroHeroesGetHeroLineages(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'hero_heroes_get_hero_lineages', {
                heroStructID: { value: parseInt(data.heroStructID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Lineage for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterBloodline
    // calls scripts/characterx/characters_get_character_bloodline.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterBloodline(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_bloodline', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Bloodline for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterElement
    // calls scripts/characterx/characters_get_character_element.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterElement(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_element', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Element for the requested character',
            result: result.callData
        }

    }


    // characterxCharactersGetCharacterData
    // calls scripts/characterx/characters_get_character_data.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterData(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_data', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'Data for the requested character',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterDataField
    // calls scripts/characterx/characters_get_character_data_field.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterDataField(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_data_field', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 },
                field: { value: data.field, type: t.String }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'The data field for the requested character is',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterTraits
    // calls scripts/characterx/characters_get_character_traits.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterTraits(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_traits', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'The traits for the requested character is',
            result: result.callData
        }

    }

    // characterxCharactersGetCharacterTraitsField
    // calls scripts/characterx/characters_get_character_traits_field.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCharactersGetCharacterTraitsField(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_characters_get_character_traits_field', {
                characterID: { value: parseInt(data.characterID), type: t.UInt32 },
                field: { value: data.field, type: t.String }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'The traits field for the requested character is',
            result: result.callData
        }

    }


    // characterxSetsGetEditionRetired
    // calls scripts/characterx/sets_get_edition_retired.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetEditionRetired(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_edition_retired', {
                setID: { value: parseInt(data.setID), type: t.UInt32 },
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'The set edition is retired',
            result: result.callData
        }

    }


    // characterxSetsGetNextSetID
    // calls scripts/characterx/sets_get_nextSetID.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetNextSetID(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_nextSetID', {}
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The next set ID is',
            result: result.callData
        }

    }


    // characterxSetsGetNumCharactersInEdition
    // calls scripts/characterx/sets_get_numCharacters_in_edition.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetNumCharactersInEdition(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_numCharacters_in_edition', {
                setID: { value: parseInt(data.setID), type: t.UInt32 },
                characterID: { value: parseInt(data.characterID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The number of the request character in edition is',
            result: result.callData
        }

    }

    // characterxSetsGetCharactersInSet
    // calls scripts/characterx/sets_get_characters_in_set.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetCharactersInSet(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_characters_in_set', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'The character ID(s) in the set',
            result: result.callData
        }

    }

    // characterxSetsGetSetIDsByName
    // calls scripts/characterx/sets_get_setIDs_by_name.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetSetIDsByName(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_setIDs_by_name', {
                setName: { value: data.setName, type: t.String }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'The set IDs by name',
            result: result.callData
        }

    }


    // characterxSetsGetSetSeries
    // calls scripts/characterx/sets_get_setSeries.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetSetSeries(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_setSeries', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Get set series',
            result: result.callData
        }

    }

    // characterxSetsGetSetLocked
    // calls scripts/characterx/sets_get_set_locked.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxSetsGetSetLocked(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_sets_get_set_locked', {
                setID: { value: parseInt(data.setID), type: t.UInt32 }

            }
        );

        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'The set is locked',
            result: result.callData
        }

    }



    // characterxCollectionsGetCollectionIds
    // calls scripts/characterx/collections_get_collection_ids.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCollectionIds(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_collection_ids', {
                account: { value: data.account, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'The account collection IDs',
            result: result.callData
        }

    }



    // characterxCollectionsGetIdInCollection
    // calls scripts/characterx/collections_get_id_in_Collection.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetIdInCollection(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_id_in_Collection', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'The Id is in collection',
            result: result.callData
        }

    }


    // characterxCollectionsGetData 
    // calls scripts/characterx/collections_get_data.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetData(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_data', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_OBJECT,
            label: 'The collections data',
            result: result.callData
        }

    }



    // characterxCollectionsGetDataField
    // calls scripts/characterx/collections_get_data_field.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetDataField(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_data_field', {
                account: { value: data.account, type: t.Address },
                characterID: { value: parseInt(data.characterID), type: t.UInt64 },
                fieldToSearch: { value: data.fieldToSearch, type: t.String }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'The collection data field',
            result: result.callData
        }

    }



    // characterxCollectionsGetCharacterCharacterID 
    // calls scripts/characterx/collections_get_character_characterID.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCharacterCharacterID(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_character_characterID', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: '',
            result: result.callData
        }

    }


    // characterxCollectionsGetCharacterSerialNum
    // calls scripts/characterx/collections_get_character_serialNum.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCharacterSerialNum(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_character_serialNum', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'The collection character serial number is',
            result: result.callData
        }

    }



    // characterxCollectionsGetCharacterSeries
    // calls scripts/characterx/collections_get_character_series.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCharacterSeries(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_character_series', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Collection character series',
            result: result.callData
        }

    }


    // characterxCollectionsGetCharacterSetID
    // calls scripts/characterx/collections_get_character_setID.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCharacterSetID(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_character_setID', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Collection character set ID',
            result: result.callData
        }

    }



    // characterxCollectionsGetCharacterSetName
    // calls scripts/characterx/collections_get_character_setName.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetCharacterSetName(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_character_setName', {
                account: { value: data.account, type: t.Address },
                id: { value: parseInt(data.id), type: t.UInt64 }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_STRING,
            label: 'Collection character set name',
            result: result.callData
        }

    }



    // characterxCollectionsGetSetCharactersAreOwned
    // calls scripts/characterx/collections_get_setCharacters_are_owned.cdc
    //
    // signer/proposer/authorizer: 
    //
    static async characterxCollectionsGetSetCharactersAreOwned(data) {

        let result = await Blockchain.get({
                config: DappLib.getConfig(),
                roles: {}
            },
            'characterx_collections_get_setCharacters_are_owned', {
                account: { value: data.account, type: t.Address },
                setIDs: DappLib.formatFlowArray(data.setIDs, t.UInt32),
                characterIDs: DappLib.formatFlowArray(data.characterIDs, t.UInt32)
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BOOLEAN,
            label: 'The collection set character are owned',
            result: result.callData
        }

    }



    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: PACK NFT  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    /********** Flow Token **********/
    /*
      static async mintFlowTokens(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: "0xf8d6e0586b0a20c7",
          }
        },
          'flowtoken_mint_flow_tokens',
          {
            recipient: { value: data.recipient, type: t.Address },
            amount: { value: data.amount, type: t.UFix64 }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async getFlowBalance(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'flowtoken_get_flow_balance',
          {
            account: { value: data.account, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_BIG_NUMBER,
          label: 'Collectible Type',
          result: result.callData
        }
      }
    */
    /********** NFT **********/
    /*
      static async provisionNFTs(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.account,
          }
        },
          'nft_provision_nfts'
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async transferNFT(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.giver,
          }
        },
          'nft_transfer_nft',
          {
            id: { value: parseInt(data.id), type: t.UInt64 },
            recipient: { value: data.recipient, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async getNFTsInCollection(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'nft_get_nfts_in_collection',
          {
            acct: { value: data.account, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_ARRAY,
          label: 'Collectible Type',
          result: result.callData
        }
      }

      static async getNFTInfo(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'nft_get_nft_info',
          {
            acct: { value: data.account, type: t.Address },
            id: { value: parseInt(data.id), type: t.UInt64 }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Collectible Type',
          result: result.callData
        }
      }
    */
    /********** Packs **********/
    /*
      static async provisionPacks(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.account,
          }
        },
          'packs_provision_packs'
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async addPackType(data) {

        let config = DappLib.getConfig();

        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: config.accounts[0]
          }
        },
          'packs_add_pack_type',
          {
            packType: { value: parseInt(data.packType), type: t.UInt64 },
            numberOfNFTs: { value: parseInt(data.numberOfNFTs), type: t.UInt64 }
          }
        );
        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }

      }

      static async mintPacks(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: config.accounts[0],
          }
        },
          'packs_mint_pack',
          {
            packType: { value: parseInt(data.packType), type: t.UInt64 },
            numberOfPacks: { value: parseInt(data.numberOfPacks), type: t.UInt64 }
          }
        );
        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }

      }

      static async transferPack(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.giver,
          }
        },
          'packs_transfer_pack',
          {
            id: { value: parseInt(data.id), type: t.UInt64 },
            recipient: { value: data.recipient, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async openPack(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: config.accounts[0],
          }
        },
          'packs_open_pack',
          {
            id: { value: parseInt(data.id), type: t.UInt64 },
            recipient: { value: data.recipient, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async getPackInfo(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'packs_get_pack_info',
          {
            id: { value: parseInt(data.id), type: t.UInt64 },
            acct: { value: data.acct, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Pack Info',
          result: result.callData
        }
      }

      static async getPackTypeInfo(data) {

        let config = DappLib.getConfig();

        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'packs_get_pack_type_info',
          {
            packType: { value: parseInt(data.packType), type: t.UInt64 }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Pack Type Info',
          result: result.callData
        }
      }

      static async getOwnedPacks(data) {
        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'packs_get_owned_packs',
          {
            acct: { value: data.account, type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_ARRAY,
          label: 'Collectible Type',
          result: result.callData
        }
      }
    */
    /********** Marketplace **********/
    /*
      static async provisionMarketplace(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.account,
          }
        },
          'marketplace_provision_marketplace'
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }

      static async listPacksForSale(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: config.accounts[0],
          }
        },
          "marketplace_list_packs_for_sale",
          {
            ids: { value: [4, 5], type: t.Array(t.UInt64) },
            price: { value: data.price, type: t.UFix64 }
          }
        );
        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }

      }

      static async getPacksAvailable(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
          config: config,
          roles: {
          }
        },
          'marketplace_get_packs_available',
          {
            admin: { value: config.accounts[0], type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Pack ID | Price',
          result: result.callData
        }
      }

      static async buyPack(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
          config: config,
          roles: {
            proposer: data.recipient,
          }
        },
          'marketplace_buy_pack',
          {
            id: { value: parseInt(data.id), type: t.UInt64 },
            admin: { value: config.accounts[0], type: t.Address }
          }
        );

        return {
          type: DappLib.DAPP_RESULT_TX_HASH,
          label: 'Transaction Hash',
          result: result.callData.transactionId
        }
      }



    */

    /*
      data - an object of key value pairs
      ex. { number: 2, id: 15 }

      types - an object that holds the type of the key 
      and value using the FCL types
      ex. { key: t.String, value: t.Int }
    */
    static formatFlowDictionary(data, types) {
        let newData = []
        let dataKeys = Object.keys(data)

        for (let key of dataKeys) {
            if (types.key.label.includes("Int")) key = parseInt(key)
            else if (types.key == t.Bool) key = (key === 'true');

            if (types.value.label.includes("Int")) data[key] = parseInt(data[key])
            else if (types.value == t.Bool) data[key] = (data[key] === 'true');
            newData.push({ key: key, value: data[key] })
        }
        return { value: newData, type: t.Dictionary(types) }
    }

    /*
      data - an array of values
      ex. ["Hello", "World", "!"]
  
      type - the type of the values using the FCL type
      ex. t.String
    */
    static formatFlowArray(data, type) {
        if (type == t.String) return { value: data, type: t.Array(type) }

        let newData = []
        for (let element of data) {
            if (type.label.includes("Int")) element = parseInt(element)
            else if (type == t.Bool) element = (element === 'true');

            newData.push(element)
        }
        return { value: newData, type: t.Array(type) }
    }

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAPP LIBRARY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static get DAPP_STATE_CONTRACT() {
        return 'dappStateContract'
    }
    static get DAPP_CONTRACT() {
        return 'dappContract'
    }

    static get DAPP_STATE_CONTRACT_WS() {
        return 'dappStateContractWs'
    }
    static get DAPP_CONTRACT_WS() {
        return 'dappContractWs'
    }

    static get DAPP_RESULT_BIG_NUMBER() {
        return 'big-number'
    }

    static get DAPP_RESULT_ACCOUNT() {
        return 'account'
    }

    static get DAPP_RESULT_TX_HASH() {
        return 'tx-hash'
    }

    static get DAPP_RESULT_IPFS_HASH_ARRAY() {
        return 'ipfs-hash-array'
    }

    static get DAPP_RESULT_SIA_HASH_ARRAY() {
        return 'sia-hash-array'
    }

    static get DAPP_RESULT_ARRAY() {
        return 'array'
    }

    static get DAPP_RESULT_OBJECT() {
        return 'object'
    }

    static get DAPP_RESULT_STRING() {
        return 'string'
    }

    static get DAPP_RESULT_ERROR() {
        return 'error'
    }

    static async addEventHandler(contract, event, params, callback) {
        Blockchain.handleEvent({
                config: DappLib.getConfig(),
                contract: contract,
                params: params || {}
            },
            event,
            (error, result) => {
                if (error) {
                    callback({
                        event: event,
                        type: DappLib.DAPP_RESULT_ERROR,
                        label: 'Error Message',
                        result: error
                    });
                } else {
                    callback({
                        event: event,
                        type: DappLib.DAPP_RESULT_OBJECT,
                        label: 'Event ' + event,
                        result: DappLib.getObjectNamedProperties(result)
                    });
                }
            }
        );
    }

    static getTransactionHash(t) {
        if (!t) { return ''; }
        let value = '';
        if (typeof t === 'string') {
            value = t;
        } else if (typeof t === 'object') {
            if (t.hasOwnProperty('transactionHash')) {
                value = t.transactionHash; // Ethereum                
            } else {
                value = JSON.stringify(t);
            }
        }
        return value;
    }

    static formatHint(hint) {
        if (hint) {
            return `<p class="mt-3 grey-text"><strong>Hint:</strong> ${hint}</p>`;
        } else {
            return '';
        }
    }

    static formatNumber(n) {
        var parts = n.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `<strong class="p-1 blue-grey-text number copy-target" style="font-size:1.1rem;" title="${n}">${parts.join(".")}</strong>`;
    }

    static formatAccount(a) {
        return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${DappLib.toCondensed(a, 6, 4)}</strong>${DappLib.addClippy(a)}`;
    }

    static formatTxHash(a) {
        let value = DappLib.getTransactionHash(a);
        return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${value}">${DappLib.toCondensed(value, 6, 4)}</strong>${DappLib.addClippy(value)}`;
    }

    static formatBoolean(a) {
        return (a ? 'YES' : 'NO');
    }

    static formatText(a, copyText) {
        if (!a) { return; }
        if (a.startsWith('<')) {
            return a;
        }
        return `<span class="copy-target" title="${copyText ? copyText : a}">${a}</span>${DappLib.addClippy(copyText ? copyText : a)}`;
    }

    static formatStrong(a) {
        return `<strong>${a}</strong>`;
    }

    static formatPlain(a) {
        return a;
    }

    static formatObject(a) {
        let data = [];
        let labels = ['Item', 'Value'];
        let keys = ['item', 'value'];
        let formatters = ['Strong', 'Text-20-5']; // 'Strong': Bold, 'Text-20-5': Compress a 20 character long string down to 5
        let reg = new RegExp('^\\d+$'); // only digits
        for (let key in a) {
            if (!reg.test(key)) {
                data.push({
                    item: key.substr(0, 1).toUpperCase() + key.substr(1),
                    value: a[key]
                });
            }
        }
        return DappLib.formatArray(data, formatters, labels, keys);
    }

    static formatArray(h, dataFormatters, dataLabels, dataKeys) {

        let output = '<table class="table table-striped">';

        if (dataLabels) {
            output += '<thead><tr>';
            for (let d = 0; d < dataLabels.length; d++) {
                output += `<th scope="col">${dataLabels[d]}</th>`;
            }
            output += '</tr></thead>';
        }
        output += '<tbody>';
        h.map((item) => {
            output += '<tr>';
            for (let d = 0; d < dataFormatters.length; d++) {
                let text = String(dataKeys && dataKeys[d] ? item[dataKeys[d]] : item);
                let copyText = dataKeys && dataKeys[d] ? item[dataKeys[d]] : item;
                if (text.startsWith('<')) {
                    output += (d == 0 ? '<th scope="row">' : '<td>') + text + (d == 0 ? '</th>' : '</td>');
                } else {
                    let formatter = 'format' + dataFormatters[d];
                    if (formatter.startsWith('formatText')) {
                        let formatterFrags = formatter.split('-');
                        if (formatterFrags.length === 3) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]), Number(formatterFrags[2]));
                        } else if (formatterFrags.length === 2) {
                            text = DappLib.toCondensed(text, Number(formatterFrags[1]));
                        }
                        formatter = formatterFrags[0];
                    }
                    output += (d == 0 ? '<th scope="row">' : '<td>') + DappLib[formatter](text, copyText) + (d == 0 ? '</th>' : '</td>');
                }
            }
            output += '</tr>';
        })
        output += '</tbody></table>';
        return output;
    }

    static getFormattedResultNode(retVal, key) {

        let returnKey = 'result';
        if (key && (key !== null) && (key !== 'null') && (typeof(key) === 'string')) {
            returnKey = key;
        }
        let formatted = '';
        switch (retVal.type) {
            case DappLib.DAPP_RESULT_BIG_NUMBER:
                formatted = DappLib.formatNumber(retVal[returnKey].toString(10));
                break;
            case DappLib.DAPP_RESULT_TX_HASH:
                formatted = DappLib.formatTxHash(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_ACCOUNT:
                formatted = DappLib.formatAccount(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_BOOLEAN:
                formatted = DappLib.formatBoolean(retVal[returnKey]);
                break;
            case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey], ['TxHash', 'IpfsHash', 'Text-10-5'], //Formatter
                    ['Transaction', 'IPFS URL', 'Doc Id'], //Label
                    ['transactionHash', 'ipfsHash', 'docId'] //Values
                );
                break;
            case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey], ['TxHash', 'SiaHash', 'Text-10-5'], //Formatter
                    ['Transaction', 'Sia URL', 'Doc Id'], //Label
                    ['transactionHash', 'docId', 'docId'] //Values
                );
                break;
            case DappLib.DAPP_RESULT_ARRAY:
                formatted = DappLib.formatArray(
                    retVal[returnKey],
                    retVal.formatter ? retVal.formatter : ['Text'],
                    null,
                    null
                );
                break;
            case DappLib.DAPP_RESULT_STRING:
                formatted = DappLib.formatPlain(
                    retVal[returnKey]
                );
                break;
            case DappLib.DAPP_RESULT_OBJECT:
                formatted = DappLib.formatObject(retVal[returnKey]);
                break;
            default:
                formatted = retVal[returnKey];
                break;
        }

        let resultNode = document.createElement('div');
        resultNode.className = `note text-xs ${retVal.type === DappLib.DAPP_RESULT_ERROR ? 'bg-red-400' : 'bg-green-400'} m-3 p-3`;
        let closeMarkup = '<div class="float-right" onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';
        resultNode.innerHTML = closeMarkup + `${retVal.type === DappLib.DAPP_RESULT_ERROR ? '☹️' : '👍️'} ` + (Array.isArray(retVal[returnKey]) ? 'Result' : retVal.label) + ': ' + formatted + DappLib.formatHint(retVal.hint);
        // Wire-up clipboard copy
        new ClipboardJS('.copy-target', {
            text: function(trigger) {
                return trigger.getAttribute('data-copy');
            }
        });

        return resultNode;
    }

    static getObjectNamedProperties(a) {
        let reg = new RegExp('^\\d+$'); // only digits
        let newObj = {};
        for (let key in a) {
            if (!reg.test(key)) {
                newObj[key] = a[key];
            }
        }
        return newObj;
    }

    static addClippy(data) {
        return `
        <svg data-copy="${data}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 22.1 23.5" style="enable-background:new 0 0 22.1 23.5;cursor:pointer;" class="copy-target" width="19px" height="20.357px" xml:space="preserve">
        <style type="text/css">
            .st99{fill:#777777;stroke:none;stroke-linecap:round;stroke-linejoin:round;}
        </style>
        <path class="st99" d="M3.9,17.4h5.4v1.4H3.9V17.4z M10.7,9.2H3.9v1.4h6.8V9.2z M13.4,13.3v-2.7l-4.1,4.1l4.1,4.1V16h6.8v-2.7H13.4z
             M7.3,12H3.9v1.4h3.4V12z M3.9,16h3.4v-1.4H3.9V16z M16.1,17.4h1.4v2.7c0,0.4-0.1,0.7-0.4,1c-0.3,0.3-0.6,0.4-1,0.4H2.6
            c-0.7,0-1.4-0.6-1.4-1.4V5.2c0-0.7,0.6-1.4,1.4-1.4h4.1c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7h4.1c0.7,0,1.4,0.6,1.4,1.4V12h-1.4
            V7.9H2.6v12.2h13.6V17.4z M3.9,6.5h10.9c0-0.7-0.6-1.4-1.4-1.4h-1.4c-0.7,0-1.4-0.6-1.4-1.4s-0.6-1.4-1.4-1.4S8,3.1,8,3.8
            S7.4,5.2,6.6,5.2H5.3C4.5,5.2,3.9,5.8,3.9,6.5z"/>
        </svg>
        `;
    }

    static getAccounts() {
        let accounts = dappConfig.accounts;
        return accounts;
    }

    static fromAscii(str, padding) {

        if (Array.isArray(str)) {
            return DappLib.arrayToHex(str);
        }

        if (str.startsWith('0x') || !padding) {
            return str;
        }

        if (str.length > padding) {
            str = str.substr(0, padding);
        }

        var hex = '0x';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            var n = code.toString(16);
            hex += n.length < 2 ? '0' + n : n;
        }
        return hex + '0'.repeat(padding * 2 - hex.length + 2);
    };


    static toAscii(hex) {
        var str = '',
            i = 0,
            l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var code = parseInt(hex.substr(i, 2), 16);
            if (code === 0) continue; // this is added
            str += String.fromCharCode(code);
        }
        return str;
    };

    static arrayToHex(bytes) {
        if (Array.isArray(bytes)) {
            return '0x' +
                Array.prototype.map.call(bytes, function(byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join('')
        } else {
            return bytes;
        }
    }

    static hexToArray(hex) {
        if ((typeof hex === 'string') && (hex.beginsWith('0x'))) {
            let bytes = [];
            for (let i = 0; i < hex.length; i += 2) {
                bytes.push(parseInt(hex.substr(i, 2), 16));
            }
            return bytes;
        } else {
            return hex;
        }
    }

    static toCondensed(s, begin, end) {
        if (!s) { return; }
        if (s.length && s.length <= begin + end) {
            return s;
        } else {
            if (end) {
                return `${s.substr(0, begin)}...${s.substr(s.length - end, end)}`;
            } else {
                return `${s.substr(0, begin)}...`;
            }
        }
    }

    static getManifest() {
        return manifest;
    }

    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    static getUniqueId() {
        return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static getConfig() {
        return dappConfig;
    }

    // Return value of this function is used to dynamically re-define getConfig()
    // for use during testing. With this approach, even though getConfig() is static
    // it returns the correct contract addresses as its definition is re-written
    // before each test run. Look for the following line in test scripts to see it done:
    //  DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);
    static getTestConfig(testDappStateContract, testDappContract, testAccounts) {

        return Object.assign({},
            dappConfig, {
                dappStateContractAddress: testDappStateContract.address,
                dappContractAddress: testDappContract.address,
                accounts: testAccounts,
                owner: testAccounts[0],
                admins: [
                    testAccounts[1],
                    testAccounts[2],
                    testAccounts[3]
                ],
                users: [
                        testAccounts[4],
                        testAccounts[5],
                        testAccounts[6],
                        testAccounts[7],
                        testAccounts[8]
                    ]
                    ///+test
            }
        );
    }

}