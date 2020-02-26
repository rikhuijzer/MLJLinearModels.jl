var documenterSearchIndex = {"docs":
[{"location":"mlj/#Working-with-MLJ-1","page":"MLJ","title":"Working with MLJ","text":"","category":"section"},{"location":"mlj/#","page":"MLJ","title":"MLJ","text":"MLJLinearModels while able to work independently of MLJ has a straightforward interface to MLJ as could be expected with the naming of the package.","category":"page"},{"location":"mlj/#","page":"MLJ","title":"MLJ","text":"Using MLJLinearModels in the context of MLJ allows to benefit from tools for encoding data, dealing with missing values, keeping track of class labels, doing hyper-parameter tuning, composing models, etc.","category":"page"},{"location":"mlj/#","page":"MLJ","title":"MLJ","text":"","category":"page"},{"location":"mlj/#","page":"MLJ","title":"MLJ","text":"TODO: example with BUPA liver data and robust regression with some hyperparameter tuning (also put it in MLJTutorials)","category":"page"},{"location":"#MLJLinearModels.jl-1","page":"Home","title":"MLJLinearModels.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This is a convenience package gathering functionalities to solve a number of generalised linear regression/classification problems which, inherently, correspond to an optimisation problem of the form","category":"page"},{"location":"#","page":"Home","title":"Home","text":"L(y Xtheta) + P(theta)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"where L is a loss function and P is a  penalty function (both of those can be scaled or composed).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"A well known example is the Ridge regression where the problem amounts to minimising","category":"page"},{"location":"#","page":"Home","title":"Home","text":"y - Xtheta_2^2 + lambdatheta_2^2","category":"page"},{"location":"#Goals-for-the-package-1","page":"Home","title":"Goals for the package","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"make these regressions models \"easy to call\" and callable in a unified way,\ninterface with MLJ.jl,\nfocus on performance including in \"big data\" settings exploiting packages such as Optim.jl, and IterativeSolvers.jl,\nuse a \"machine learning\" perspective, i.e.: focus primarily on prediction, hyper-parameters should be obtained via a data-driven procedure such as cross-validation.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"All models allow to fit an intercept and allow the penalty to be optionally applied on the intercept (not applied by default). All models attempt to be efficient in terms of memory allocation to avoid unnecessary copies of the data.","category":"page"},{"location":"#Quick-start-1","page":"Home","title":"Quick start","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The package works by","category":"page"},{"location":"#","page":"Home","title":"Home","text":"specifying the kind of model you want along with its hyper-parameters,\ncalling fit with that model and the data: fit(model, X, y).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"note: Note\nThe convention is that the feature matrix has dimensions n times p where n is the number of records (points) and p is the number of features (dimensions).","category":"page"},{"location":"#Lasso-regression-1","page":"Home","title":"Lasso regression","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The lasso regression corresponds to a l2-loss function with a l1-penalty:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"theta_textLasso = frac12y-Xtheta_2^2 + lambdatheta_1","category":"page"},{"location":"#","page":"Home","title":"Home","text":"which you can create as follows:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"λ = 0.7\nlasso = LassoRegression(0.7)\nfit(lasso, X, y)","category":"page"},{"location":"#(Multinomial)-logistic-classifier-1","page":"Home","title":"(Multinomial) logistic classifier","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"In a classification context, the multinomial logistic regression returns a predicted score per class that can be interpreted as the likelihood of a point belonging to a class given the trained model. It's given by the multinomial loss plus an optional penalty (typically the l2 penalty).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Here's a way to do this:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"λ = 0.1\nmlr = MultinomialRegression(λ) # you can also just use LogisticRegression\nfit(mlr, X, y)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In a binary context, y is expected to have values y_i in pm 1 whereas in the multiclass context, y is expected to have values y_i in 1 dots c where c  2 is the number of classes.","category":"page"},{"location":"#Available-models-1","page":"Home","title":"Available models","text":"","category":"section"},{"location":"#Regression-models-(continuous-target)-1","page":"Home","title":"Regression models (continuous target)","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Regressors Formulation¹ Available solvers Comments\nOLS & Ridge L2Loss + 0/L2 Analytical² or CG³ \nLasso & Elastic-Net L2Loss + 0/L2 + L1 (F)ISTA⁴ \nRobust 0/L2 RobustLoss⁵ + 0/L2 Newton, NewtonCG, LBFGS, IWLS-CG⁶ no scale⁷\nRobust L1/EN RobustLoss + 0/L2 + L1 (F)ISTA \nQuantile⁸ + 0/L2 RobustLoss + 0/L2 LBFGS, IWLS-CG \nQuantile L1/EN RobustLoss + 0/L2 + L1 (F)ISTA ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"\"0\" stands for no penalty\nAnalytical means the solution is computed in \"one shot\" using the \\ solver,\nCG = conjugate gradient\n(Accelerated) Proximal Gradient Descent\nHuber, Andrews, Bisquare, Logistic, Fair and Talwar weighing functions available.\nIteratively re-Weighted Least Squares where each system is solved iteratively via CG\nIn other packages such as Scikit-Learn, a scale factor is estimated along with the parameters, this is a bit ad-hoc and corresponds more to a statistical perspective, further it does not work well with penalties; we recommend using cross-validation to set the parameter of the Huber Loss.\nIncludes as special case the least absolute deviation (LAD) regression when δ=0.5.","category":"page"},{"location":"#Classification-models-(finite-target)-1","page":"Home","title":"Classification models (finite target)","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Classifiers Formulation Available solvers Comments\nLogistic 0/L2 LogisticLoss + 0/L2 Newton, Newton-CG, LBFGS yᵢ∈{±1}\nLogistic L1/EN LogisticLoss + 0/L2 + L1 (F)ISTA yᵢ∈{±1}\nMultinomial 0/L2 MultinomialLoss + 0/L2 Newton-CG, LBFGS yᵢ∈{1,...,c}\nMultinomial L1/EN MultinomialLoss + 0/L2 + L1 ISTA, FISTA yᵢ∈{1,...,c}","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Unless otherwise specified:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Newton-like solvers use Hager-Zhang line search (default in Optim.jl)\nISTA, FISTA solvers use backtracking line search and a shrinkage factor of β=0.8","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Note: these models were all tested for correctness whenever a direct comparison with another package was possible, usually by comparing the objective function at the coefficients returned (cf. the tests):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"(against scikit-learn): Lasso, Elastic-Net, Logistic (L1/L2/EN), Multinomial (L1/L2/EN)\n(against quantreg): Quantile (0/L1)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Systematic timing benchmarks have not been run yet but it's planned (see this issue).","category":"page"},{"location":"#Limitations-1","page":"Home","title":"Limitations","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Note the current limitations:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The models are built and tested assuming n > p; if this doesn't hold, tricks should be employed to speed up computations; these have not been implemented yet.\nCV-aware code not implemented yet (code that re-uses computations when fitting over a number of hyper-parameters);  \"Meta\" functionalities such as One-vs-All or Cross-Validation are left to other packages such as MLJ.\nNo support yet for sparse matrices.\nStochastic solvers have not yet been implemented.\nAll computations are assumed to be done in Float64.","category":"page"}]
}
