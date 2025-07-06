const std = @import("std");
const to = @import("207f");

pub fn main() !void {
    const text = "Hello world";
    _ = to.in_range(text.ptr, text.len);
}
