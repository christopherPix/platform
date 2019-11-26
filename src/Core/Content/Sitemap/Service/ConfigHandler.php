<?php declare(strict_types=1);

namespace Shopware\Core\Content\Sitemap\Service;

use Shopware\Core\Content\Sitemap\ConfigHandler\ConfigHandlerInterface;
use Shopware\Core\Content\Sitemap\Exception\InvalidSitemapKey;

class ConfigHandler
{
    public const EXCLUDED_URLS_KEY = 'excluded_urls';
    public const CUSTOM_URLS_KEY = 'custom_urls';

    /**
     * @var \IteratorAggregate<int, ConfigHandlerInterface>
     */
    private $configHandlers;

    public function __construct(\IteratorAggregate $configHandlers)
    {
        $this->configHandlers = $configHandlers;
    }

    public function get(string $key): array
    {
        $filteredUrls = [];
        $customUrls = [];

        /** @var ConfigHandlerInterface $configHandler */
        foreach ($this->configHandlers as $configHandler) {
            $config = $configHandler->getSitemapConfig();
            $filteredUrls = $this->addUrls($filteredUrls, $config[self::EXCLUDED_URLS_KEY]);
            $customUrls = $this->addUrls($customUrls, $config[self::CUSTOM_URLS_KEY]);
        }

        if ($key === self::EXCLUDED_URLS_KEY) {
            return $filteredUrls;
        }

        if ($key === self::CUSTOM_URLS_KEY) {
            return $customUrls;
        }

        throw new InvalidSitemapKey($key);
    }

    private function addUrls(array $urls, array $config): array
    {
        foreach ($config as $configUrl) {
            $urls[] = $configUrl;
        }

        return $urls;
    }
}
