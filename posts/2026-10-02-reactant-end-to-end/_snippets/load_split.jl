const TILE = (3, 224, 224)                 # bytes on disk are (C, W, H, N)

function load_split(dir, split)
    images = open(joinpath(dir, "$(split)_images.u8")) do io
        Mmap.mmap(io, Array{UInt8, 4}, (TILE..., filesize(io) ÷ prod(TILE)))
    end
    labels = Int.(read(joinpath(dir, "$(split)_labels.u8"))) .+ 1   # 0-based on disk
    return images, labels
end
