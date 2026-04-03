<?php

class Analyzer {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function analyze($text, $url = '') {
        $suspiciousKeywords = $this->getSuspiciousKeywords();
        $trustedSources = $this->getTrustedSources();

        $confidenceScore = 50; // Initial confidence
        $matchedKeywords = [];
        $isTrustedSource = false;
        $matchedSourceName = '';

        // Keyword analysis
        foreach ($suspiciousKeywords as $keywordEntry) {
            $keyword = $keywordEntry['keyword'];
            $weight = $keywordEntry['weight'];
            
            // Check if keyword exists in text
            if (mb_stripos($text, $keyword) !== false) {
                $matchedKeywords[] = $keyword;
                $confidenceScore -= $weight;
            }
        }

        // Source analysis
        if (!empty($url)) {
            $parsedUrl = parse_url($url);
            $domain = isset($parsedUrl['host']) ? strtolower($parsedUrl['host']) : '';
            
            // Handle cases where host might be 'www.bbc.com' instead of 'bbc.com'
            if (strpos($domain, 'www.') === 0) {
                $domain = substr($domain, 4);
            }

            foreach ($trustedSources as $source) {
                if ($domain === strtolower($source['domain'])) {
                    $isTrustedSource = true;
                    $matchedSourceName = $source['source_name'];
                    $confidenceScore += 40; // Increase confidence for trusted sources
                    break;
                }
            }
        }

        // Clamp confidence score between 0 and 100
        $confidenceScore = max(0, min(100, $confidenceScore));

        // Determine status
        if ($confidenceScore > 70) {
            $status = 'trusted';
            $status_ar = "خبر موثوق";
        } elseif ($confidenceScore >= 40) {
            $status = 'uncertain';
            $status_ar = "غير مؤكد";
        } else {
            $status = 'fake';
            $status_ar = "احتمال عالي أنه خبر كاذب";
        }

        // Log result
        $this->logAnalysis($text, $url, $status, $confidenceScore);

        return [
            'confidence' => $confidenceScore,
            'status' => $status,
            'status_ar' => $status_ar,
            'matched_keywords' => $matchedKeywords,
            'is_trusted_source' => $isTrustedSource,
            'source_name' => $matchedSourceName,
            'reasons' => $this->generateReasons($confidenceScore, $matchedKeywords, $isTrustedSource, $matchedSourceName)
        ];
    }

    private function getSuspiciousKeywords() {
        $stmt = $this->pdo->query("SELECT * FROM suspicious_keywords");
        return $stmt->fetchAll();
    }

    private function getTrustedSources() {
        $stmt = $this->pdo->query("SELECT * FROM trusted_sources");
        return $stmt->fetchAll();
    }

    private function logAnalysis($text, $url, $status, $score) {
        $stmt = $this->pdo->prepare("INSERT INTO analysis_logs (input_text, source_url, result_status, confidence_score) VALUES (?, ?, ?, ?)");
        $stmt->execute([$text, $url, $status, $score]);
    }

    private function generateReasons($score, $keywords, $isTrusted, $sourceName) {
        $reasons = [];
        if (!empty($keywords)) {
            $reasons[] = "تم العثور على كلمات مثيرة للشك: " . implode(', ', $keywords);
        }
        if ($isTrusted) {
            $reasons[] = "المصدر موثوق: $sourceName";
        }
        if ($score < 40) {
            $reasons[] = "النص يحتوي على العديد من العلامات التي تشير إلى احتمال كونه مضللاً.";
        } elseif ($score > 70) {
            $reasons[] = "يبدو أن الخبر من مصدر ذو مصداقية ولا يحتوي على كلمات مضللة بكثرة.";
        }
        return $reasons;
    }
}
