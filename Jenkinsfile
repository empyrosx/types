@Library('pipeline') _

def version = '20.2000'

node ('controls') {
    checkout_pipeline("20.2000/bugfix/bls/fix_coverage")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('types', version)
}