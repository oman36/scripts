#! /usr/bin/php
<?php
/**
 * @param string $file
 * @return bool|int
 */
function fixLineEndingInFile(string $file)
{
    echo "Fix line ending in {$file}\n";
    return file_put_contents($file, preg_replace("~\r~",'', file_get_contents($file)));
}

/**
 * @param array $lines
 * @return array
 */
function parse(array $lines): array
{
    $files = [];

    foreach ($lines as $line) {
        if (preg_match('~^(?P<added>\d+)\s*(?P<removed>\d+)\s*(?P<file>.+)~', $line, $m)) {
            $files[$m['file']] = $m;
        }
    }

    return $files;
}

exec('git diff --numstat  --diff-filter=M', $lines);
$files = parse($lines);

exec('git diff --numstat  --diff-filter=M -w', $lines);
$files2 = parse($lines);

foreach ($files as $file => $data) {
    if (!isset($files2[$file])) {
        continue;
    }
    if ($files2[$file]['removed'] === $data['removed']) {
        continue;
    }
    fixLineEndingInFile($file);
}
