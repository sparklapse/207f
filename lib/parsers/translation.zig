//! Translation cleansing is where a single character can be represented in a direct translation to 1 or more 207f characters

const VisualSimilarity = enum(u8) {
    /// The characters are identical (or almost identical)
    identical,
    /// The characters are identical but accented
    accented,
    /// The characters have the same meaning but look different
    semantic,
};
