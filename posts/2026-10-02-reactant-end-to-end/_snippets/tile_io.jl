struct TileIO <: AbstractInferenceIO
    images::Array{UInt8, 4}           # memory-mapped, (C, W, H, N)
    logits::Matrix{Float32}           # filled in as responses arrive
end
Base.length(io::TileIO) = size(io.images, 4)
ReactantServerClient.item_input_bytes(::TileIO) = prod(TILE)

function ReactantServerClient.infer_encode_chunk!(io::TileIO, r::UnitRange, slot::PoolSlot)
    input = scratch(slot, "img", (224, 224, 3, length(r)), UInt8)
    buf = pool_view(input)
    for (k, i) in enumerate(r)        # (C, W, H) on disk to the model's (W, H, C)
        permutedims!(view(buf, :, :, :, k), view(io.images, :, :, :, i), (2, 3, 1))
    end
    return input
end

function ReactantServerClient.infer_decode_chunk!(io::TileIO, r::UnitRange, response)
    io.logits[:, r] = InferOutput("logits", response, Float32)
    return nothing
end
