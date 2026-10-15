ReactantNitro.forward(e::PathMNIST, model, ps, st; img) = Lux.apply(model, img, ps, st)

function cross_entropy(e::PathMNIST, logits, label)
    onehot = reshape(1:e.num_classes, :, 1) .== reshape(label, 1, :)
    return -mean(sum(onehot .* logsoftmax(logits; dims = 1); dims = 1))
end

ReactantNitro.loss(e::PathMNIST, out; label) =
    cross_entropy(e, out.logits, label) + e.kinetic_weight * mean(out.energy)

ReactantNitro.train_metrics(e::PathMNIST, out) =
    (; kinetic = mean(out.energy), motion = mean(out.motion))
