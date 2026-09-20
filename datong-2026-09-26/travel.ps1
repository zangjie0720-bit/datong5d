param(
    [Parameter(Mandatory=$true, Position=0)][string]$Action,
    [Parameter(Position=1)][string]$Unit,
    [string]$Items,
    [string]$Note,
    [string]$Target,
    [string]$Source,
    [string]$Pack,
    [string]$RecordType,
    [switch]$KeepUnitOpen,
    [string]$Step,
    [string]$Outcome,
    [string]$Layer,
    [string]$EventId
)
$ErrorActionPreference = 'Stop'
$boundArguments = @{}
foreach ($entry in $PSBoundParameters.GetEnumerator()) {
    $boundArguments[$entry.Key] = $entry.Value
}
$boundArguments['Workbench'] = $PSScriptRoot
$boundArguments['PythonExecutable'] = 'C:/Users/75772/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
& 'C:/Users/75772/.codex/skills/build-personalized-travel-guide-open-source/scripts/work_unit.ps1' @boundArguments
exit $LASTEXITCODE
