function ReactantNitro.build_data(e::PathMNIST, dist)
    ensure_dataset_mmapable(e)      # downloads and converts on first use
    # Training drops its short final batch (fixed program shape); eval keeps
    # it, and Nitro pads and slices it back.
    loader(split, train) = DataLoader(
        PathMNISTSplit(e, split; augment = train);
        batchsize = e.batch_size, shuffle = train, partial = !train,
        rng = Xoshiro(e.seed)
    )
    return (;
        train = loader("train", true), val = loader("val", false),
        test = loader("test", false),
    )
end
