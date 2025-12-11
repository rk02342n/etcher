import { importer } from "ipfs-unixfs-importer";
import { MemoryBlockstore } from "blockstore-core/memory";

export const predictCid = async (file) => {
    try {
        const version = 1;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blockstore = new MemoryBlockstore();

        let rootCid;

        for await (const result of importer([{ content: buffer }], blockstore, {
            cidVersion: version,
            hashAlg: "sha2-256",
            rawLeaves: version === 1,
        })) {
            rootCid = result.cid;
        }
        return rootCid.toString();
    } catch (err) {
        return err;
    }
};
