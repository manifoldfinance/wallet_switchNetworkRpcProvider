
interface ProviderCreator {
    name: string;
    networks: Array<string>;
    create: (network: string) => null | AbstractProvider;
};


const allNetworks = [ "default", "homestead" ];

const ProviderCreators: Array<ProviderCreator> = [
    {
        name: "AlchemyProvider",
        networks: allNetworks,
        create: function(network: string) {
            return new AlchemyProvider(network, "YrPw6SWb20vJDRFkhWq8aKnTQ8JRNRHM");
        }
    },

  {
    name: "CloudflareProvider",
    networks: [ "default", "homestead" ],
    create: function(network: string) {
        return new CloudflareProvider(network);
    }
},

export const providerNames = Object.freeze(ProviderCreators.map((c) => (c.name)));

function getCreator(provider: string): null | ProviderCreator {
    const creators = ProviderCreators.filter((c) => (c.name === provider));
    if (creators.length === 1) { return creators[0]; }
    return null;
}

export function getProviderNetworks(provider: string): Array<string> {
    const creator = getCreator(provider);
    if (creator) { return creator.networks; }
    return [ ];
}

export function getProvider(provider: string, network: string): null | AbstractProvider {
    const creator = getCreator(provider);
    if (creator) { return creator.create(network); }
    return null;
}

export function connect(network: string): AbstractProvider {
    const provider = getProvider("InfuraProvider", network);
    if (provider == null) { throw new Error(`could not connect to ${ network }`); }
    return provider;
}
