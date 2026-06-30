import ipaddress


def calculate_subnet(cidr: str):
    network = ipaddress.ip_network(cidr, strict=False)

    return {
        "networkAddress": str(network.network_address),
        "broadcastAddress": str(network.broadcast_address),
        "subnetMask": str(network.netmask),
        "wildcardMask": str(network.hostmask),
        "firstUsableHost": str(network.network_address + 1),
        "lastUsableHost": str(network.broadcast_address - 1),
        "totalAddresses": network.num_addresses,
        "usableHosts": network.num_addresses - 2,
    }