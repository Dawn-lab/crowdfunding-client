import { useContext, createContext, FC, ReactNode } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

interface StateInterface {
    address: string,
    contract: object,
    connect: () => void,
    createCampaign: any,
    getCampaigns: () => void,
    getUserCampaigns: () => void,
    donate: any,
    getDonations: any
}

export const StateContext = createContext<StateInterface>({
    address: "",
    contract: {},
    connect: () => {},
    createCampaign: () => {},
    getCampaigns: () => {},
    getUserCampaigns: () => {},
    donate: () => {},
    getDonations: () => {}
});

interface stateProps {
    children: ReactNode;
}

export const StateContextProvider : FC<stateProps> = ({ children }) => {
    const { contract } : any = useContract('0x63c0c280eAe8f58B0A6e8c451DED8B8Bac8d94f2');

    console.log(contract)

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    // const result = await contract.methods.myFunction().call();

    const address = useAddress() as string;
    const connect = useMetamask();

    const publishCampaign = async (form: { title: unknown | ethers.CallOverrides; description: unknown | ethers.CallOverrides; target: unknown | ethers.CallOverrides; deadline: string | number | Date; image: unknown | ethers.CallOverrides; }) => {
        try {
            const data = await createCampaign([
                address, // owner
                form.title, // title
                form.description, // description
                form.target,
                new Date(form.deadline).getTime(), // deadline,
                form.image
            ])

            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error)
        }
    }

    const getCampaigns = async () => {

        const campaigns = await contract.call('getCampaigns');

        const parsedCampaings = campaigns.map((campaign: { owner: any; title: any; description: any; target: { toString: () => ethers.BigNumberish; }; deadline: { toNumber: () => any; }; amountCollected: { toString: () => ethers.BigNumberish; }; image: any; }, i: any) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
        }));

        return parsedCampaings;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign: { owner: string | undefined; }) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId: unknown | ethers.CallOverrides, amount: string) => {
        const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount) });

        return data;
    }

    const getDonations = async (pId: unknown | ethers.CallOverrides) => {
        const donations = await contract.call('getDonators', pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }


    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);