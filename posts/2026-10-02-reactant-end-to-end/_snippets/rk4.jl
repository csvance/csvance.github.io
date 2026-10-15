# Fixed-step RK4 over t in [0, 1]. Also returns each sample's kinetic energy,
# ∫|f(u)|² dt, from the four stage evaluations.
function rk4(f, u, steps::Integer)
    T = eltype(u)
    dt = one(T) / T(steps)
    half, sixth = dt / T(2), dt / T(6)
    sq(k) = sum(abs2, k; dims = 1)
    energy = zero(sq(u))
    for _ in 1:steps
        k1 = f(u)
        k2 = f(u .+ half .* k1)
        k3 = f(u .+ half .* k2)
        k4 = f(u .+ dt .* k3)
        u = u .+ sixth .* (k1 .+ T(2) .* k2 .+ T(2) .* k3 .+ k4)
        energy = energy .+ sixth .* (sq(k1) .+ T(2) .* sq(k2) .+ T(2) .* sq(k3) .+ sq(k4))
    end
    return (; u, energy)
end
