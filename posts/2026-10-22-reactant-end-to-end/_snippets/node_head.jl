# Augmented NeuralODE head. The state is [a; z]: `a` comes from the pooled
# features, and `z` starts at zero and ends as the logits.
function node_head(e::PathMNIST, width::Integer)
    # captured, not passed to @compact (they would land in st)
    steps, A, K = e.node_steps, e.aug_dims, e.num_classes
    D = A + K
    return @compact(
        proj = Dense(width => A),
        enc = Dense(D => e.node_hidden, tanh),
        dec = Dense(e.node_hidden => D; init_weight = zeros32, init_bias = zeros32),
    ) do pooled                            # (width, N)
        a0 = proj(pooled)
        u0 = vcat(a0, zeros(eltype(a0), K) .* a0[1:1, :])   # z(0) = 0
        (; u, energy) = rk4(u -> dec(enc(u)), u0, steps)
        motion = sqrt.(sum(abs2, u .- u0; dims = 1) ./ sum(abs2, u0; dims = 1))
        @return (; logits = u[(A + 1):D, :], energy, motion)
    end
end
