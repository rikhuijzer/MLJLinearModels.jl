n, p = 500, 5
((X, y, θ), (X1, y1, θ1)) = generate_continuous(n, p; seed=525)

# adding some outliers (both positive and negative)
y1a = outlify(y1, 0.1)

@testset "QuantileReg" begin
    δ = 0.5 # effectively LAD regression
    λ = 1.0
    rr = QuantileRegression(δ, lambda=λ, penalize_intercept=true,
                               scale_penalty_with_samples = false)
    J = objective(rr, X, y1a)
    o = RobustLoss(Quantile(δ)) + λ * L2Penalty()
    @test J(θ1) ≈ o(y1a, X1*θ1, θ1)
    ls = LinearRegression()
    θ_ls    = fit(ls, X, y1a)
    θ_lbfgs = fit(rr, X, y1a, solver=LBFGS())
    θ_iwls  = fit(rr, X, y1a, solver=IWLSCG())
    @test isapprox(J(θ1),      412.20773, rtol=1e-5)
    @test isapprox(J(θ_ls),    508.02443, rtol=1e-5)  # LS is crap bc outliers
    @test isapprox(J(θ_lbfgs), 411.98228, rtol=1e-5)
    @test isapprox(J(θ_iwls),  411.98,    rtol=1e-4)

    # NOTE: newton and newton-cg not available because ϕ = 0 identically
    # will throw an error if called.
    @test_throws ErrorException fit(rr, X, y1, solver=Newton())
    @test_throws ErrorException fit(rr, X, y1, solver=NewtonCG())

    # don't penalize intercept
    rr = QuantileRegression(δ, lambda=λ, scale_penalty_with_samples = false)
    J = objective(rr, X, y1a)
    ls = LinearRegression()
    θ_ls    = fit(ls, X, y1a)
    θ_lbfgs = fit(rr, X, y1a, solver=LBFGS())
    θ_iwls  = fit(rr, X, y1a, solver=IWLSCG())
    @test isapprox(J(θ1),      412.18594, rtol=1e-5)
    @test isapprox(J(θ_ls),    508.00993, rtol=1e-5)  # note that LS is crap due to outliers
    @test isapprox(J(θ_lbfgs), 411.95990, rtol=1e-5)
    @test isapprox(J(θ_iwls),  411.98,    rtol=1e-4)

    if DO_COMPARISONS
        # Compare with R's QuantReg package
        # NOTE: QuantReg doesn't allow for penalties so re-fitting with λ=0
        rr = QuantileRegression(δ, lambda=0)
        J  = objective(rr, X, y1a)
        θ_ls     = fit(LinearRegression(), X, y1a)
        θ_lbfgs  = fit(rr, X, y1a, solver=LBFGS())
        θ_iwls   = fit(rr, X, y1a, solver=IWLSCG())
        θ_qr_br  = rcopy(QUANTREG.rq_fit_br(X1, y1a))[:coefficients]
        θ_qr_fnb = rcopy(QUANTREG.rq_fit_fnb(X1, y1a))[:coefficients]
        # NOTE: we take θ_qr_br as reference point
        @test isapprox(J(θ_ls), 505.45286,  rtol=1e-5)
        @test J(θ_qr_br) ≈      409.570777 # <- ref value
        # Their IP algorithm essentially gives the same answer
        @test (J(θ_qr_fnb) - J(θ_qr_br)) ≤ 1e-10
        # Our algorithms are close enough
        @test isapprox(J(θ_lbfgs), 409.57154, rtol=1e-5)
        @test isapprox(J(θ_iwls),  409.59,    rtol=1e-4)
    end
end

###########################
## With Sparsity penalty ##
###########################

n, p = 500, 100
((X, y, θ), (X1, y1, θ1)) = generate_continuous(n, p;  seed=51112, sparse=0.1)
# pepper with outliers
y1a  = outlify(y1, 0.1)

@testset "LAD+L1" begin
    λ = 5.0
    γ = 10.0
    rr = LADRegression(λ, γ; penalize_intercept=true, scale_penalty_with_samples = false)
    J  = objective(rr, X, y1a)
    θ_ls    = X1 \ y1a
    θ_fista = fit(rr, X, y1a, solver=FISTA())
    θ_ista  = fit(rr, X, y1a, solver=ISTA())
    @test isapprox(J(θ_ls),    1058.6737, rtol=1e-5)
    @test isapprox(J(θ_fista), 454.23322, rtol=1e-5)
    @test isapprox(J(θ_ista),  454.27774, rtol=1e-5)
    @test nnz(θ_fista) == 43
    @test nnz(θ_ista)  == 43

    if DO_COMPARISONS
        # Compare with R's QuantReg package
        # NOTE: QuantReg doesn't apply the penalty on the intercept
        rr = LADRegression(5.0; penalty=:l1, scale_penalty_with_samples = false)
        J  = objective(rr, X, y1a)
        θ_ls       = X1 \ y1a
        θ_fista    = fit(rr, X, y1a, solver=FISTA())
        θ_ista     = fit(rr, X, y1a, solver=ISTA())
        θ_qr_lasso = rcopy(QUANTREG.rq_fit_lasso(X1, y1a))[:coefficients]
        @test isapprox(J(θ_ls),       888.3748, rtol=1e-5)
        @test isapprox(J(θ_qr_lasso), 425.5264, rtol=1e-5)
        # Our algorithms are close enough
        @test isapprox(J(θ_fista),    425.0526, rtol=1e-5)
        @test isapprox(J(θ_ista),     425.4113, rtol=1e-5)
        # in this case we do a fair bit better
        @test nnz(θ_qr_lasso) == 101
        @test nnz(θ_fista)    == 88
        @test nnz(θ_ista)     == 82
        # in this case fista is best
        @test J(θ_fista) < J(θ_ista) < J(θ_qr_lasso)
    end
end
