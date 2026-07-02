<?php

declare(strict_types=1);

final class Validator
{
    public static function email(string $email): bool
    {
        return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function nonEmpty(string $value): bool
    {
        return trim($value) !== '';
    }
}
